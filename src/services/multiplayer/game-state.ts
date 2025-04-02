
import { supabase } from "@/lib/supabase";
import { GameStateListener, GameResultListener, MultiplayerGameState, MultiplayerGameResult } from "./types";

export class GameStateService {
  private channel: any;
  private gameStateListeners: GameStateListener[] = [];
  private gameResultListeners: GameResultListener[] = [];
  private currentGame: MultiplayerGameState | null = null;
  private gameStartTime: number = 0;
  private gameTimerId: number | null = null;

  /**
   * Subscribe to game state changes
   */
  public subscribeToGameState(callback: GameStateListener) {
    this.gameStateListeners.push(callback);
    if (this.currentGame) {
      callback(this.currentGame);
    }
    return () => {
      this.gameStateListeners = this.gameStateListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to game result
   */
  public subscribeToGameResult(callback: GameResultListener) {
    this.gameResultListeners.push(callback);
    return () => {
      this.gameResultListeners = this.gameResultListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Updates the currently stored game state
   */
  public setGameState(gameState: MultiplayerGameState) {
    this.currentGame = gameState;
    this.notifyGameStateListeners();
  }

  /**
   * Get the current game state
   */
  public getGameState(): MultiplayerGameState | null {
    return this.currentGame;
  }

  /**
   * Notify all game state listeners of the current state
   */
  public notifyGameStateListeners() {
    if (this.currentGame) {
      this.gameStateListeners.forEach(listener => listener(this.currentGame!));
    }
  }

  /**
   * Notify all game result listeners
   */
  public notifyGameResultListeners(result: MultiplayerGameResult) {
    this.gameResultListeners.forEach(listener => listener(result));
  }

  /**
   * Set up realtime listener for game updates
   */
  public setupRealtimeListener(gameId: string) {
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
            // Fix typing issue by casting the status to the correct type
            const typedGame: MultiplayerGameState = {
              ...payload.new as any,
              status: (payload.new as any).status as 'waiting' | 'active' | 'completed'
            };
            
            this.currentGame = typedGame;
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

  /**
   * Start the game timer
   */
  public startGameTimer() {
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
    }
    
    this.gameStartTime = Date.now();
    this.gameTimerId = window.setInterval(() => this.updateGameTime(), 1000);
  }

  /**
   * Update the game time remaining
   */
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

  /**
   * Handle the end of a game
   */
  private handleGameEnd() {
    if (!this.currentGame) return;

    const { player1_score, player2_score, player1_id, player2_id } = this.currentGame;
    
    // Determine winner based on scores
    let winnerId: string | null = null;
    let isDraw = false;
    
    if (player1_score > player2_score) {
      winnerId = player1_id;
    } else if (player2_score > player1_score) {
      winnerId = player2_id;
    } else {
      isDraw = true;
    }

    // Notify all listeners about the game result
    const result: MultiplayerGameResult = {
      winner_id: winnerId,
      player1_score,
      player2_score,
      player1_id,
      player2_id,
      is_draw: isDraw
    };

    this.notifyGameResultListeners(result);
  }

  /**
   * End the game with an optional winner
   */
  public async endGame(winnerId: string | null = null) {
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

    this.notifyGameResultListeners(result);

    // Clean up
    if (this.gameTimerId) {
      clearInterval(this.gameTimerId);
      this.gameTimerId = null;
    }
  }

  /**
   * Clean up all resources
   */
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
