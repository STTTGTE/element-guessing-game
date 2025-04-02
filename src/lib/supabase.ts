import { createClient } from '@supabase/supabase-js'

// Use the values from the integrations/supabase/client.ts file which are already properly configured
import { supabase as supabaseClient } from '@/integrations/supabase/client'

export const supabase = supabaseClient

// Define types for database tables
export type GameHistory = {
  id: string
  user_id: string
  score: number
  total_questions: number
  created_at: string
  game_mode?: string
}

export type Profile = {
  id: string
  username: string
  avatar_url?: string
  created_at: string
}

export type UserStreak = {
  user_id: string
  current_streak: number
  max_streak: number
  last_played: string | null
  created_at: string
}

export type Achievement = {
  id: string
  name: string
  description: string
  icon?: string
  condition: string
  created_at: string
}

export type UserAchievement = {
  id: string
  user_id: string
  achievement_id: string
  created_at: string
  achievement?: Achievement
}

export type MultiplayerGame = {
  id: string
  player1_id: string
  player2_id: string
  status: 'active' | 'completed'
  created_at: string
  updated_at: string
}

export type Match = {
  id: string
  player1_id: string
  player2_id: string
  scores: Record<string, number>
  current_question: any
  question_number: number
  status: 'active' | 'completed'
  created_at: string
  updated_at: string
}

export type Matchmaking = {
  id: string
  user_id: string
  status: 'searching' | 'matched'
  created_at: string
}

// Define database schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      game_history: {
        Row: GameHistory
        Insert: Omit<GameHistory, 'id' | 'created_at'>
        Update: Partial<Omit<GameHistory, 'id' | 'created_at'>>
      }
      user_streaks: {
        Row: UserStreak
        Insert: Omit<UserStreak, 'created_at'>
        Update: Partial<Omit<UserStreak, 'user_id' | 'created_at'>>
      }
      achievements: {
        Row: Achievement
        Insert: Omit<Achievement, 'id' | 'created_at'>
        Update: Partial<Omit<Achievement, 'id' | 'created_at'>>
      }
      user_achievements: {
        Row: UserAchievement
        Insert: Omit<UserAchievement, 'id' | 'created_at'>
        Update: Partial<Omit<UserAchievement, 'id' | 'created_at'>>
      }
      multiplayer_games: {
        Row: MultiplayerGame
        Insert: Omit<MultiplayerGame, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MultiplayerGame, 'id' | 'created_at'>>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Match, 'id' | 'created_at'>>
      }
      matchmaking: {
        Row: Matchmaking
        Insert: Omit<Matchmaking, 'id' | 'created_at'>
        Update: Partial<Omit<Matchmaking, 'id' | 'created_at'>>
      }
    }
  }
}
