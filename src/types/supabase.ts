
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          condition: string
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          condition: string
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          condition?: string
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      game_history: {
        Row: {
          created_at: string
          game_mode: string | null
          id: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_mode?: string | null
          id?: string
          score: number
          total_questions: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_mode?: string | null
          id?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      matchmaking: {
        Row: {
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          current_question: Json
          id: string
          player1_id: string
          player2_id: string
          question_number: number
          scores: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_question: Json
          id?: string
          player1_id: string
          player2_id: string
          question_number?: number
          scores?: Json
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_question?: Json
          id?: string
          player1_id?: string
          player2_id?: string
          question_number?: number
          scores?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      multiplayer_games: {
        Row: {
          created_at: string
          current_question_index: number
          id: string
          is_active: boolean
          player1_errors: number
          player1_id: string
          player1_score: number
          player2_errors: number
          player2_id: string | null
          player2_score: number
          status: string
          time_remaining: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_question_index?: number
          id?: string
          is_active?: boolean
          player1_errors?: number
          player1_id: string
          player1_score?: number
          player2_errors?: number
          player2_id?: string | null
          player2_score?: number
          status: string
          time_remaining?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_question_index?: number
          id?: string
          is_active?: boolean
          player1_errors?: number
          player1_id?: string
          player1_score?: number
          player2_errors?: number
          player2_id?: string | null
          player2_score?: number
          status?: string
          time_remaining?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
          achievement?: {
            id: string
            name: string
            description: string
            icon: string | null
            condition: string
            created_at: string
          }
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          last_played: string | null
          max_streak: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          last_played?: string | null
          max_streak?: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          last_played?: string | null
          max_streak?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];
export type GameHistory = Database['public']['Tables']['game_history']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserStreak = Database['public']['Tables']['user_streaks']['Row'];
export type Matchmaking = Database['public']['Tables']['matchmaking']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type MultiplayerGame = Database['public']['Tables']['multiplayer_games']['Row'];
