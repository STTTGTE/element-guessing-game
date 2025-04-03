
import { supabase } from '@/lib/supabase';
import { User } from "@supabase/supabase-js";
import { ElementData, Question } from '@/types/game';
import { Match, Matchmaking } from '@/types/supabase';
import { questions } from '@/data/questions';

export type GameStatus = 'waiting' | 'active' | 'completed';

export interface GameState {
  gameId: string | null;
  matchmakingId: string | null;
  players: string[];
  currentQuestion: Question | null;
  scores: Record<string, number>;
  questionNumber: number;
  isSearching: boolean;
  error: string | null;
  loading: boolean;
}

export interface GameResult {
  winnerId: string | null;
  scores: Record<string, number>;
  isDraw: boolean;
  players: string[];
}

class MultiplayerService {
  private channel: ReturnType<typeof supabase.channel> | null = null;
  
  // Initialize game state
  getInitialState(): GameState {
    return {
      gameId: null,
      matchmakingId: null,
      players: [],
      currentQuestion: null,
      scores: {},
      questionNumber: 0,
      isSearching: false,
      error: null,
      loading: false
    };
  }
  
  // Start matchmaking
  async startMatchmaking(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('matchmaking')
        .insert({
          user_id: userId,
          status: 'searching'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return (data as Matchmaking).id;
    } catch (error) {
      console.error('Error starting matchmaking:', error);
      throw error;
    }
  }
  
  // Cancel matchmaking
  async cancelMatchmaking(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('matchmaking')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      this.unsubscribeFromChannel();
    } catch (error) {
      console.error('Error cancelling matchmaking:', error);
      throw error;
    }
  }
  
  // Join an existing game
  async joinGame(gameId: string): Promise<Match> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', gameId)
        .single();
      
      if (error) throw error;
      
      return data as Match;
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }
  
  // Submit an answer
  async submitAnswer(
    gameId: string, 
    userId: string, 
    element: ElementData, 
    question: Question
  ): Promise<boolean> {
    try {
      const isCorrect = element.symbol === question.correctElement;
      
      // Get current game state
      const { data: gameData, error: gameError } = await supabase
        .from('matches')
        .select('scores, question_number')
        .eq('id', gameId)
        .single();
      
      if (gameError) throw gameError;
      
      // Parse scores
      let scores: Record<string, number> = {};
      try {
        scores = typeof gameData.scores === 'string' 
          ? JSON.parse(gameData.scores) 
          : gameData.scores;
      } catch (e) {
        scores = {};
      }
      
      // Update score
      if (isCorrect) {
        scores[userId] = (scores[userId] || 0) + 1;
      }
      
      // Get next question
      const questionNumber = (gameData.question_number + 1) % questions.length;
      const nextQuestion = questions[questionNumber];
      
      // Safely convert the Question to a JSON-compatible object
      const questionJson = {
        id: nextQuestion.id,
        text: nextQuestion.text,
        correctElement: nextQuestion.correctElement,
        hint: nextQuestion.hint || null,
        difficulty: nextQuestion.difficulty || null
      };
      
      // Update game state
      const { error: updateError } = await supabase
        .from('matches')
        .update({
          scores,
          question_number: questionNumber,
          current_question: questionJson
        })
        .eq('id', gameId);
      
      if (updateError) throw updateError;
      
      return isCorrect;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }
  
  // Subscribe to game state changes
  subscribeToGameChanges(gameId: string, callback: (data: Match) => void): void {
    this.unsubscribeFromChannel();
    
    this.channel = supabase
      .channel(`match-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            callback(payload.new as Match);
          }
        }
      )
      .subscribe();
  }
  
  // Unsubscribe from channel
  unsubscribeFromChannel(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
  
  // Get a random question
  getRandomQuestion(): Question {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }
  
  // Check for existing game
  async checkExistingGame(userId: string): Promise<{ matchmaking: Matchmaking | null, match: Match | null }> {
    try {
      // Check matchmaking
      const { data: matchmakingData, error: matchmakingError } = await supabase
        .from('matchmaking')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (matchmakingError && matchmakingError.code !== 'PGRST116') {
        console.error('Error checking matchmaking:', matchmakingError);
      }
      
      // Check active match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
        .eq('status', 'active')
        .single();
      
      if (matchError && matchError.code !== 'PGRST116') {
        console.error('Error checking matches:', matchError);
      }
      
      return {
        matchmaking: matchmakingData as Matchmaking,
        match: matchData as Match
      };
    } catch (error) {
      console.error('Error checking existing game:', error);
      throw error;
    }
  }
}

export const multiplayerService = new MultiplayerService();
export default multiplayerService;
