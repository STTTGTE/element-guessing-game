
import { Question } from "@/types/game";
import { User } from "@supabase/supabase-js";

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

export interface GameStateListener {
  (state: MultiplayerGameState): void;
}

export interface GameResultListener {
  (result: MultiplayerGameResult): void;
}
