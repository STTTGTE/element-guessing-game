import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Use the values from the integrations/supabase/client.ts file which are already properly configured
import { supabase as supabaseClient } from '@/integrations/supabase/client'

// Export the supabase client directly
export const supabase = supabaseClient;

// Define types for database tables
export type GameHistory = {
  id: string
  user_id: string
  score: number
  total_questions: number
  created_at: string
  game_type?: string
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
  created_at: string
}

export type UserAchievement = {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  created_at?: string
  achievement?: Achievement
}

export type MultiplayerGame = {
  id: string
  player1_id: string
  player2_id: string | null
  player1_score: number
  player2_score: number
  player1_errors: number
  player2_errors: number
  current_question_index: number
  is_active: boolean
  time_remaining: number
  status: 'waiting' | 'active' | 'completed'
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

// Create a more flexible generic type for database operations
export type DatabaseTables = {
  achievements: Achievement;
  game_history: GameHistory;
  multiplayer_games: MultiplayerGame;
  user_achievements: UserAchievement;
  user_streaks: UserStreak;
  matches: Match;
  matchmaking: Matchmaking;
  profiles: Profile;
}
