
import { createClient } from '@supabase/supabase-js'

// Use the values from the integrations/supabase/client.ts file which are already properly configured
import { supabase as supabaseClient } from '@/integrations/supabase/client'

export const supabase = supabaseClient

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
