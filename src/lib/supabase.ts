
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Use the values from the integrations/supabase/client.ts file which are already properly configured
import { supabase as supabaseClient } from '@/integrations/supabase/client'

export const supabase = supabaseClient

// Re-export types
export type {
  Achievement,
  UserAchievement,
  GameHistory,
  Profile,
  UserStreak,
  Matchmaking,
  Match,
  MultiplayerGame
} from '@/types/supabase'
