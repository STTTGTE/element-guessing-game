
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ElementData, Question } from "@/types/game";
import { questions } from "@/data/questions";

export type MultiplayerGameState = {
  id: string;
  player1_id: string;
  player2_id: string | null;
  player1_score: number;
  player2_score: number;
  player1_errors: number;
  player2_errors: number;
  current_question_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  time_remaining: number;
  status: 'waiting' | 'active' | 'completed';
};

export type MultiplayerGameResult = {
  winner_id: string | null;
  player1_score: number;
  player2_score: number;
  player1_id: string;
  player2_id: string | null;
  is_draw: boolean;
};

class MultiplayerService {
  private channel: any;
  private gameStateListeners: ((state: MultiplayerGameState) => void)[] = [];
  private gameResultListeners: ((result: MultiplayerGameResult) => void)[] = [];
  private currentGame: MultiplayerGameState | null = null;
  private gameQuestions: Question[] = [];
  private gameStartTime: number = 0;
  private gameTimerId: number | null = null;

  constructor() {
    // Get 10 random questions for the game
    this.gameQuestions = this.getRandomQuestions(10);
  }

  private getRandomQuestions(count: number): Question[] {
    // Shuffle questions and get the first `count`
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  public subscribeToGameState(callback: (state: MultiplayerGameState) => void) {
    this.gameStateListeners.push(callback);
    if (this.currentGame) {
      callback(this.currentGame);
    }
    return () => {
      this.gameStateListeners = this.gameStateListeners.filter(cb => cb !== callback);
    };
  }

  public subscribeToGameResult(callback: (result: MultiplayerGameResult) => void) {
    this.gameResultListeners.push(callback);
    return () => {
      this.gameResultListeners = this.gameResultListeners.filter(cb => cb !== callback);
    };
  }

  public async findGame(user: User): Promise<MultiplayerGameState | null> {
    try {
      // First check if there's any waiting game
      const { data, error } = await supabase
        .from('multiplayer_games')
        .select('*')
        .eq('status', 'waiting')
        .neq('player1_id', user.id)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error finding game:', error);
        return null;
      }

      if (data) {
        // Join existing game
        const { data: updatedGame, error: updateError } = await supabase
          .from('multiplayer_games')
          .update({
            player2_id: user.id,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id)
          .select('*')
          .single();

        if (updateError) {
          console.error('Error joining game:', updateError);
          return null;
        }

        this.currentGame = updatedGame;
        this.setupRealtimeListener(updatedGame.id);
        this.notifyGameStateListeners();
        this.startGameTimer();
        return updatedGame;
      } else {
        // Create new game
        const { data: newGame, error: createError } = await supabase
          .from('multiplayer_games')
          .insert({
            player1_id: user.id,
            player1_score: 0,
            player2_score: 0,
            player1_errors: 0,
            player2_errors: 0,
            current_question_index: 0,
            is_active: true,
            time_remaining: 180, // 3 minutes in seconds
            status: 'waiting'
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating game:', createError);
          return null;
        }

        this.currentGame = newGame;
        this.setupRealtimeListener(newGame.id);
        this.notifyGameStateListeners();
        return newGame;
      }
    } catch (error) {
      console.error('Error in findGame:', error);
      return null;
    }
  }

  private setupRealtimeListener(gameId: string) {
    // Remove existing channel if any
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }

    // Subscribe to changes on this game
    this.channel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'multiplayer_games',
          filter: `id=eq.${gameId}`
        }, 
        (payload) => {
          if (payload.new) {
            this.currentGame = payload.new as MultiplayerGameState;
            this.notifyGameStateListeners();
            
            // Check if game is completed
            if (this.currentGame.status === 'completed') {
              this.handleGameEnd();
            }
          }
        }
      )
      .subscribe();
  }

  private notifyGameStateListeners() {
    if (this.currentGame) {
      this.gameStateListeners.forEach(listener => listener(this.currentGame!));
    }
  }

  private startGameTimer() {
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
    }
    
    this.gameStartTime = Date.now();
    this.gameTimerId = window.setInterval(() => this.updateGameTime(), 1000);
  }

  private async updateGameTime() {
    if (!this.currentGame || this.currentGame.status !== 'active') {
      if (this.gameTimerId) {
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
      }
      return;
    }

    const elapsedSeconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
    const timeRemaining = Math.max(0, 180 - elapsedSeconds); // 3 minutes = 180 seconds
    
    if (timeRemaining === 0) {
      // Time's up, end the game
      await this.endGame();
      if (this.gameTimerId) {
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
      }
    } else if (this.currentGame) {
      // Update time remaining
      await supabase
        .from('multiplayer_games')
        .update({ time_remaining: timeRemaining })
        .eq('id', this.currentGame.id);
    }
  }

  public async answerQuestion(element: ElementData, userId: string): Promise<boolean> {
    if (!this.currentGame || this.currentGame.status !== 'active') {
      return false;
    }

    const isPlayer1 = userId === this.currentGame.player1_id;
    const currentQuestion = this.gameQuestions[this.currentGame.current_question_index];
    const isCorrect = element.symbol === currentQuestion.correctElement;
    
    const updates: any = {};
    
    if (isPlayer1) {
      if (isCorrect) {
        updates.player1_score = this.currentGame.player1_score + 1;
      } else {
        updates.player1_errors = this.currentGame.player1_errors + 1;
        // Check if max errors reached
        if (this.currentGame.player1_errors + 1 >= 3) {
          await this.endGame(this.currentGame.player2_id);
          return false;
        }
      }
    } else {
      if (isCorrect) {
        updates.player2_score = this.currentGame.player2_score + 1;
      } else {
        updates.player2_errors = this.currentGame.player2_errors + 1;
        // Check if max errors reached
        if (this.currentGame.player2_errors + 1 >= 3) {
          await this.endGame(this.currentGame.player1_id);
          return false;
        }
      }
    }

    // Move to next question
    updates.current_question_index = (this.currentGame.current_question_index + 1) % this.gameQuestions.length;

    // Update game state
    await supabase
      .from('multiplayer_games')
      .update(updates)
      .eq('id', this.currentGame.id);

    return isCorrect;
  }

  public getCurrentQuestion(): Question | null {
    if (!this.currentGame) return null;
    return this.gameQuestions[this.currentGame.current_question_index];
  }

  public async leaveGame(userId: string) {
    if (!this.currentGame) return;

    if (this.currentGame.status === 'waiting') {
      // Cancel the game if it's still waiting
      await supabase
        .from('multiplayer_games')
        .delete()
        .eq('id', this.currentGame.id);
    } else if (this.currentGame.status === 'active') {
      // Forfeit the game if it's active
      const winnerId = userId === this.currentGame.player1_id 
        ? this.currentGame.player2_id 
        : this.currentGame.player1_id;
      
      await this.endGame(winnerId);
    }

    // Clean up
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
      this.gameTimerId = null;
    }
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.currentGame = null;
  }

  private async endGame(winnerId: string | null = null) {
    if (!this.currentGame) return;

    const { player1_score, player2_score, player1_id, player2_id } = this.currentGame;
    
    // Determine winner if not specified
    let finalWinnerId = winnerId;
    let isDraw = false;
    
    if (!finalWinnerId) {
      if (player1_score > player2_score) {
        finalWinnerId = player1_id;
      } else if (player2_score > player1_score) {
        finalWinnerId = player2_id;
      } else {
        isDraw = true;
      }
    }

    // Update game status
    await supabase
      .from('multiplayer_games')
      .update({
        status: 'completed',
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.currentGame.id);

    // Notify all listeners about the game result
    const result: MultiplayerGameResult = {
      winner_id: finalWinnerId,
      player1_score,
      player2_score,
      player1_id,
      player2_id,
      is_draw: isDraw
    };

    this.gameResultListeners.forEach(listener => listener(result));

    // Clean up
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
      this.gameTimerId = null;
    }
  }

  public getGameState(): MultiplayerGameState | null {
    return this.currentGame;
  }

  public cleanup() {
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
      this.gameTimerId = null;
    }
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.gameStateListeners = [];
    this.gameResultListeners = [];
    this.currentGame = null;
  }
}

// Create a singleton instance
export const multiplayerService = new MultiplayerService();

// Export the service
export default multiplayerService;
