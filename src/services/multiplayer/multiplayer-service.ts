
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ElementData } from "@/types/game";
import { GameStateService } from "./game-state";
import { GameQuestionsService } from "./game-questions";
import { 
  MultiplayerGameState, 
  MultiplayerGameResult, 
  GameStateListener, 
  GameResultListener 
} from "./types";

class MultiplayerService {
  private gameStateService: GameStateService;
  private gameQuestionsService: GameQuestionsService;

  constructor() {
    this.gameStateService = new GameStateService();
    this.gameQuestionsService = new GameQuestionsService();
  }

  /**
   * Subscribe to game state changes
   */
  public subscribeToGameState(callback: GameStateListener) {
    return this.gameStateService.subscribeToGameState(callback);
  }

  /**
   * Subscribe to game result
   */
  public subscribeToGameResult(callback: GameResultListener) {
    return this.gameStateService.subscribeToGameResult(callback);
  }

  /**
   * Find or create a multiplayer game
   */
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
            status: 'active' as const,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id)
          .select('*')
          .single();

        if (updateError) {
          console.error('Error joining game:', updateError);
          return null;
        }

        // Fix typing issue by casting the status to the correct type
        const typedGame: MultiplayerGameState = {
          ...updatedGame,
          status: updatedGame.status as 'waiting' | 'active' | 'completed'
        };

        this.gameStateService.setGameState(typedGame);
        this.gameStateService.setupRealtimeListener(typedGame.id);
        this.gameStateService.startGameTimer();
        return typedGame;
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
            status: 'waiting' as const
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating game:', createError);
          return null;
        }

        // Fix typing issue by casting the status to the correct type
        const typedGame: MultiplayerGameState = {
          ...newGame,
          status: newGame.status as 'waiting' | 'active' | 'completed'
        };

        this.gameStateService.setGameState(typedGame);
        this.gameStateService.setupRealtimeListener(typedGame.id);
        return typedGame;
      }
    } catch (error) {
      console.error('Error in findGame:', error);
      return null;
    }
  }

  /**
   * Process a player's answer to a question
   */
  public async answerQuestion(element: ElementData, userId: string): Promise<boolean> {
    const currentGame = this.gameStateService.getGameState();
    if (!currentGame || currentGame.status !== 'active') {
      return false;
    }

    const isPlayer1 = userId === currentGame.player1_id;
    const currentQuestion = this.gameQuestionsService.getQuestion(currentGame.current_question_index);
    
    if (!currentQuestion) return false;
    
    const isCorrect = element.symbol === currentQuestion.correctElement;
    
    const updates: any = {};
    
    if (isPlayer1) {
      if (isCorrect) {
        updates.player1_score = currentGame.player1_score + 1;
      } else {
        updates.player1_errors = currentGame.player1_errors + 1;
        // Check if max errors reached
        if (currentGame.player1_errors + 1 >= 3) {
          await this.gameStateService.endGame(currentGame.player2_id);
          return false;
        }
      }
    } else {
      if (isCorrect) {
        updates.player2_score = currentGame.player2_score + 1;
      } else {
        updates.player2_errors = currentGame.player2_errors + 1;
        // Check if max errors reached
        if (currentGame.player2_errors + 1 >= 3) {
          await this.gameStateService.endGame(currentGame.player1_id);
          return false;
        }
      }
    }

    // Move to next question
    updates.current_question_index = (currentGame.current_question_index + 1) % this.gameQuestionsService.getAllQuestions().length;

    // Update game state
    await supabase
      .from('multiplayer_games')
      .update(updates)
      .eq('id', currentGame.id);

    return isCorrect;
  }

  /**
   * Get the current question
   */
  public getCurrentQuestion() {
    const currentGame = this.gameStateService.getGameState();
    if (!currentGame) return null;
    
    return this.gameQuestionsService.getQuestion(currentGame.current_question_index);
  }

  /**
   * Leave the current game
   */
  public async leaveGame(userId: string) {
    const currentGame = this.gameStateService.getGameState();
    if (!currentGame) return;

    if (currentGame.status === 'waiting') {
      // Cancel the game if it's still waiting
      await supabase
        .from('multiplayer_games')
        .delete()
        .eq('id', currentGame.id);
    } else if (currentGame.status === 'active') {
      // Forfeit the game if it's active
      const winnerId = userId === currentGame.player1_id 
        ? currentGame.player2_id 
        : currentGame.player1_id;
      
      await this.gameStateService.endGame(winnerId);
    }

    // Clean up resources
    this.gameStateService.cleanup();
  }

  /**
   * Get the current game state
   */
  public getGameState(): MultiplayerGameState | null {
    return this.gameStateService.getGameState();
  }

  /**
   * Clean up all resources
   */
  public cleanup() {
    this.gameStateService.cleanup();
  }
}

// Create a singleton instance
export const multiplayerService = new MultiplayerService();

// Export the service and types
export default multiplayerService;
export * from './types';
