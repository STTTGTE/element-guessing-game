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
    if (!session.user) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      console.log('Updating streak for user:', session.user.id);

      // If no streak exists, create a new one
      if (!userStreak) {
        console.log('No streak found, creating new streak');
        await createNewStreak(session.user.id);
        return 1; // Indicate the start of a new streak
      }

      const lastPlayed = userStreak.last_played ? new Date(userStreak.last_played).toISOString().split('T')[0] : null;
      console.log('Last played:', lastPlayed, 'Today:', today);

      if (lastPlayed === today) {
        // Already played today, do nothing
        console.log('Already played today, keeping current streak:', userStreak.current_streak);
        return userStreak.current_streak;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      let newMaxStreak = userStreak.max_streak;

      if (lastPlayed === yesterdayStr) {
        // Played yesterday, increment streak
        console.log('Played yesterday, incrementing streak');
        newStreak = userStreak.current_streak + 1;
        if (newStreak > userStreak.max_streak) {
          newMaxStreak = newStreak;
        }
      } else if (!lastPlayed) {
        // First time playing
        console.log('First time playing');
        newStreak = 1;
      } else {
        // Streak broken, reset to 1
        console.log('Streak broken, resetting to 1');
        newStreak = 1;
      }

      console.log('Updating streak:', { newStreak, newMaxStreak });

      // Update streak in database
      const { data, error } = await supabase
        .from('user_streaks')
        .upsert({
          user_id: session.user.id,
          current_streak: newStreak,
          max_streak: newMaxStreak,
          last_played: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating streak:', error);
        return userStreak.current_streak;
      }

      // Update local state
      const updatedStreak = data as unknown as UserStreak;
      console.log('Streak updated:', updatedStreak);
      setUserStreak(updatedStreak);

      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      return userStreak?.current_streak;
    }
  };

  return {
    userStreak,
    loading,
    updateStreak,
    fetchUserStreak
  }
}
