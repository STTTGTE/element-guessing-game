
import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { supabase, UserStreak } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useStreaks() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [streak, setStreak] = useState<UserStreak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session.user) {
      fetchStreak()
    } else {
      setLoading(false)
    }
  }, [session.user])

  const fetchStreak = async () => {
    if (!session.user) return

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          // Initialize streak
          await initializeStreak()
        } else {
          throw error
        }
      } else {
        setStreak(data)
        // Check if streak needs to be reset
        if (data) {
          const lastPlayed = new Date(data.last_played)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          // If the user hasn't played in more than a day, reset streak
          if (lastPlayed < yesterday) {
            if (isMoreThanOneDay(lastPlayed, today)) {
              await resetStreak()
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching streak:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeStreak = async () => {
    if (!session.user) return

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .insert([
          { user_id: session.user.id, current_streak: 1, max_streak: 1 }
        ])
        .select()
        .single()

      if (error) throw error
      setStreak(data)
    } catch (error) {
      console.error('Error initializing streak:', error)
    }
  }

  const updateStreak = async () => {
    if (!session.user || !streak) return

    try {
      const lastPlayed = new Date(streak.last_played)
      const today = new Date()
      
      // Format dates to compare just the date part (ignoring time)
      const lastPlayedDate = lastPlayed.toISOString().split('T')[0]
      const todayDate = today.toISOString().split('T')[0]
      
      // Only increment streak if the user hasn't played today
      if (lastPlayedDate !== todayDate) {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayDate = yesterday.toISOString().split('T')[0]
        
        // If the user played yesterday, increment streak
        if (lastPlayedDate === yesterdayDate) {
          const newCurrentStreak = streak.current_streak + 1
          const newMaxStreak = Math.max(newCurrentStreak, streak.max_streak)
          
          const { data, error } = await supabase
            .from('user_streaks')
            .update({ 
              current_streak: newCurrentStreak, 
              max_streak: newMaxStreak,
              last_played: today.toISOString()
            })
            .eq('user_id', session.user.id)
            .select()
            .single()
            
          if (error) throw error
          setStreak(data)
          
          // Show streak notification if it's a new day
          toast({
            title: "Streak Updated!",
            description: `You're on a ${newCurrentStreak} day streak! Keep it up!`,
            className: "bg-green-500 text-white"
          })
          
          return newCurrentStreak
        } else {
          // If the user didn't play yesterday but played before, reset streak to 1
          if (isMoreThanOneDay(lastPlayed, today)) {
            await resetStreak()
            return 1
          }
        }
      }
      
      // Update last_played to today
      const { data, error } = await supabase
        .from('user_streaks')
        .update({ last_played: today.toISOString() })
        .eq('user_id', session.user.id)
        .select()
        .single()
        
      if (error) throw error
      setStreak(data)
      return data.current_streak
    } catch (error) {
      console.error('Error updating streak:', error)
      return streak.current_streak
    }
  }

  const resetStreak = async () => {
    if (!session.user) return

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .update({ 
          current_streak: 1, 
          last_played: new Date().toISOString() 
        })
        .eq('user_id', session.user.id)
        .select()
        .single()
        
      if (error) throw error
      setStreak(data)
      
      toast({
        title: "Streak Reset",
        description: "Your streak has been reset. Play daily to build it back up!",
        variant: "destructive"
      })
      
      return 1
    } catch (error) {
      console.error('Error resetting streak:', error)
      return 1
    }
  }

  // Helper function to check if more than a day has passed
  const isMoreThanOneDay = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 1
  }

  return {
    streak,
    loading,
    updateStreak,
    resetStreak
  }
}
