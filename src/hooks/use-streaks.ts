import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { supabase, UserStreak } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useStreaks() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session.user) {
      fetchUserStreak()
    } else {
      setLoading(false)
    }
  }, [session.user])

  const fetchUserStreak = async () => {
    if (!session.user) return

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user streak:', error)
        setLoading(false)
        return
      }

      if (!data) {
        // If no streak exists, create a new one
        await createNewStreak(session.user.id)
        return // Exit to prevent further errors, the next fetch will get the new streak
      }

      setUserStreak(data as unknown as UserStreak)
    } catch (error) {
      console.error('Error fetching user streak:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewStreak = async (userId: string) => {
    try {
      // First check if a streak already exists to avoid duplicate inserts
      const { data: existingStreak, error: checkError } = await supabase
        .from('user_streaks')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking for existing streak:', checkError);
        return;
      }
      
      // If streak already exists, no need to create a new one
      if (existingStreak) {
        console.log('Streak already exists, fetching it');
        fetchUserStreak();
        return;
      }
      
      // Create a new streak with proper data structure
      const { error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          last_played: null
        });

      if (error) {
        console.error('Error creating new streak:', error);
        return;
      }

      // After creating, immediately fetch the new streak
      fetchUserStreak();
    } catch (error) {
      console.error('Error creating new streak:', error);
    }
  }

  const updateStreak = async (): Promise<number | undefined> => {
    if (!session.user) return

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    try {
      // If no streak exists, create a new one
      if (!userStreak) {
        await createNewStreak(session.user.id)
        return 1 // Indicate the start of a new streak
      }

      const lastPlayed = userStreak.last_played ? userStreak.last_played.split('T')[0] : null

      if (lastPlayed === today) {
        // Already played today, do nothing
        return userStreak.current_streak
      }

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = 1
      if (lastPlayed === yesterdayStr) {
        // Continue streak
        newStreak = (userStreak.current_streak || 0) + 1
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userStreak.longest_streak || 0),
          last_played: new Date().toISOString(),
        })
        .eq('user_id', session.user.id)
        .select()
        .single()

      if (error) throw error

      setUserStreak(data)
      return data.current_streak
    } catch (error) {
      console.error('Error updating streak:', error)
      toast({
        title: "Streak Error",
        description: "Failed to update streak. Please try again.",
        variant: "destructive",
      })
      return undefined
    }
  }

  return {
    userStreak,
    loading,
    updateStreak: session.user ? updateStreak : () => Promise.resolve(0)
  }
}
