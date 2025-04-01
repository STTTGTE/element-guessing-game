
import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { supabase, Achievement, UserAchievement } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useAchievements() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session.user) {
      fetchAchievements()
      fetchUserAchievements()
    } else {
      setLoading(false)
    }
  }, [session.user])

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setAchievements(data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAchievements = async () => {
    if (!session.user) return
    
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', session.user.id)

      if (error) throw error
      setUserAchievements(data)
    } catch (error) {
      console.error('Error fetching user achievements:', error)
    }
  }

  const checkAndGrantAchievements = async (score: number, streak: number) => {
    if (!session.user) return
    
    try {
      // Get achievements that the user doesn't have yet
      const unearned = achievements.filter(achievement => 
        !userAchievements.some(ua => ua.achievement_id === achievement.id)
      )
      
      // Check each achievement if it should be granted
      for (const achievement of unearned) {
        const condition = achievement.condition
        let shouldGrant = false
        
        // Evaluate the condition
        if (condition.includes('score >=')) {
          const requiredScore = parseInt(condition.split('>=')[1].trim())
          shouldGrant = score >= requiredScore
        } else if (condition.includes('streak >=')) {
          const requiredStreak = parseInt(condition.split('>=')[1].trim())
          shouldGrant = streak >= requiredStreak
        }
        
        if (shouldGrant) {
          // Grant the achievement
          const { error } = await supabase
            .from('user_achievements')
            .insert([
              { user_id: session.user.id, achievement_id: achievement.id }
            ])
            
          if (error) throw error
          
          // Show toast notification
          toast({
            title: "Achievement Unlocked!",
            description: `${achievement.name}: ${achievement.description}`,
            className: "bg-amber-500 text-white border-amber-600"
          })
          
          // Refresh user achievements
          fetchUserAchievements()
        }
      }
    } catch (error) {
      console.error('Error granting achievements:', error)
    }
  }

  return {
    achievements,
    userAchievements,
    loading,
    checkAndGrantAchievements: session.user ? checkAndGrantAchievements : () => Promise.resolve()
  }
}
