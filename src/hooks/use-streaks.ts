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
      setLoading(true)
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
      // Use upsert instead of insert to handle potential conflicts
      const { error } = await supabase
        .from('user_streaks')
        .upsert({
          user_id: userId,
          current_streak: 0,
          max_streak: 0,
          last_played: null
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: true
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
      let newMaxStreak = userStreak.max_streak

      if (lastPlayed === yesterdayStr) {
        // Played yesterday, increment streak
        newStreak = userStreak.current_streak + 1
        if (newStreak > userStreak.max_streak) {
          newMaxStreak = newStreak
        }
      } else {
        // Streak broken, reset to 1
        newStreak = 1
      }

      // Update streak in database
      const { error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          max_streak: newMaxStreak,
          last_played: new Date().toISOString()
        })
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error updating streak:', error)
        return userStreak.current_streak
      }

      // Update local state
      setUserStreak({
        ...userStreak,
        current_streak: newStreak,
        max_streak: newMaxStreak,
        last_played: new Date().toISOString()
      })

      return newStreak
    } catch (error) {
      console.error('Error updating streak:', error)
      return userStreak?.current_streak
    }
  }

  return {
    userStreak,
    loading,
    updateStreak,
    fetchUserStreak
  }
}
