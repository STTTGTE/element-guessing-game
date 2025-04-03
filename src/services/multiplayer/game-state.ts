
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { questions } from "@/data/questions";
import { MultiplayerGameState, MultiplayerGameResult, GameStateListener, GameResultListener } from "./types";

export class GameStateService {
  private gameState: MultiplayerGameState | null = null;
  private channel: RealtimeChannel | null = null;
  private gameStateListeners: GameStateListener[] = [];
  private gameResultListeners: GameResultListener[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor() {}

  /**
   * Set the game state
   */
  public setGameState(gameState: MultiplayerGameState) {
    this.gameState = gameState;
    // Notify all listeners
    this.notifyGameStateListeners();
  }

  /**
   * Get the current game state
   */
  public getGameState(): MultiplayerGameState | null {
    return this.gameState;
  }

  /**
   * Subscribe to game state changes
   */
  public subscribeToGameState(callback: GameStateListener): () => void {
    this.gameStateListeners.push(callback);
    
    // Immediately call the callback with the current state if it exists
    if (this.gameState) {
      callback(this.gameState);
    }
    
    // Return unsubscribe function
    return () => {
      this.gameStateListeners = this.gameStateListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to game result
   */
  public subscribeToGameResult(callback: GameResultListener): () => void {
    this.gameResultListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.gameResultListeners = this.gameResultListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Setup realtime listener for game state changes
   */
  public setupRealtimeListener(gameId: string) {
    // Clean up existing channel if any
    this.cleanup();
    
    // Create a new channel
    this.channel = supabase
      .channel(`game-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'multiplayer_games',
          filter: `id=eq.${gameId}`
        },
        (payload) => {
          console.log('Game state changed:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as any;
            
            const updatedGameState: MultiplayerGameState = {
              id: newData.id,
              player1_id: newData.player1_id,
              player2_id: newData.player2_id,
              player1_score: newData.player1_score,
              player2_score: newData.player2_score,
              player1_errors: newData.player1_errors,
              player2_errors: newData.player2_errors,
              current_question_index: newData.current_question_index,
              is_active: newData.is_active,
              time_remaining: newData.time_remaining,
              status: newData.status,
              created_at: newData.created_at,
              updated_at: newData.updated_at
            };
            
            this.gameState = updatedGameState;
            this.notifyGameStateListeners();
            
            // Check if game is completed
            if (updatedGameState.status === 'completed') {
              this.handleGameCompleted(updatedGameState);
            }
          } else if (payload.eventType === 'DELETE') {
            this.gameState = null;
            this.notifyGameStateListeners();
            this.cleanup();
          }
        }
      )
      .subscribe();
  }

  /**
   * Start the game timer
   */
  public startGameTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      if (this.gameState && this.gameState.status === 'active') {
        const newTimeRemaining = Math.max(0, this.gameState.time_remaining - 1);
        
        // Update local state first for responsive UI
        this.gameState = {
          ...this.gameState,
          time_remaining: newTimeRemaining
        };
        
        this.notifyGameStateListeners();
        
        // Update time in database every 5 seconds to reduce database load
        if (newTimeRemaining % 5 === 0 || newTimeRemaining === 0) {
          this.updateTimeRemaining(newTimeRemaining);
        }
        
        // End game if time is up
        if (newTimeRemaining === 0) {
          this.handleTimeUp();
        }
      }
    }, 1000);
  }

  /**
   * Update the time remaining in the database
   */
  private async updateTimeRemaining(newTime: number) {
    if (!this.gameState) return;
    
    try {
      await supabase
        .from('multiplayer_games')
        .update({ 
          time_remaining: newTime 
        })
        .eq('id', this.gameState.id);
    } catch (error) {
      console.error('Error updating time remaining:', error);
    }
  }

  /**
   * Handle game timer reaching zero
   */
  private async handleTimeUp() {
    if (!this.gameState) return;
    
    // Determine winner based on score
    let winnerId: string | null = null;
    
    if (this.gameState.player1_score > this.gameState.player2_score) {
      winnerId = this.gameState.player1_id;
    } else if (this.gameState.player2_score > this.gameState.player1_score) {
      winnerId = this.gameState.player2_id;
    } // Null means it's a draw
    
    await this.endGame(winnerId);
  }

  /**
   * End the game and declare a winner
   */
  public async endGame(winnerId: string | null) {
    if (!this.gameState) return;
    
    try {
      await supabase
        .from('multiplayer_games')
        .update({
          status: 'completed',
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.gameState.id);
      
      // Create a game result object
      const gameResult: MultiplayerGameResult = {
        winner_id: winnerId,
        player1_score: this.gameState.player1_score,
        player2_score: this.gameState.player2_score,
        player1_id: this.gameState.player1_id,
        player2_id: this.gameState.player2_id,
        is_draw: winnerId === null
      };
      
      // Notify result listeners
      this.notifyGameResultListeners(gameResult);
      
      // Stop the timer
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  }
  
  /**
   * Handle game completed event
   */
  private handleGameCompleted(gameState: MultiplayerGameState) {
    // Determine winner based on score
    let winnerId: string | null = null;
    
    if (gameState.player1_score > gameState.player2_score) {
      winnerId = gameState.player1_id;
    } else if (gameState.player2_score > gameState.player1_score) {
      winnerId = gameState.player2_id;
    } // Null means it's a draw
    
    // Create a game result object
    const gameResult: MultiplayerGameResult = {
      winner_id: winnerId,
      player1_score: gameState.player1_score,
      player2_score: gameState.player2_score,
      player1_id: gameState.player1_id,
      player2_id: gameState.player2_id,
      is_draw: winnerId === null
    };
    
    // Notify result listeners
    this.notifyGameResultListeners(gameResult);
    
    // Stop the timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Notify all game state listeners
   */
  private notifyGameStateListeners() {
    if (!this.gameState) return;
    
    for (const listener of this.gameStateListeners) {
      listener(this.gameState);
    }
  }
  
  /**
   * Notify all game result listeners
   */
  private notifyGameResultListeners(result: MultiplayerGameResult) {
    for (const listener of this.gameResultListeners) {
      listener(result);
    }
  }

  /**
   * Clean up all resources
   */
  public cleanup() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
