
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export type GameHistory = {
  id: string
  user_id: string
  score: number
  total_questions: number
  created_at: string
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
  last_played: string
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
  earned_at: string
  achievement?: Achievement
}
