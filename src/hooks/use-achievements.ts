
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { UserAchievement, Achievement } from '@/types/supabase';

export function useAchievements() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user achievements from the database
  const fetchAchievements = async () => {
    if (!session.user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');
      
      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);
      
      // Fetch user achievements
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          user_id,
          achievement_id,
          earned_at,
          achievement:achievements(*)
        `)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // The data returned has the correct shape for our UserAchievement type
      setUserAchievements(data || []);
    } catch (error: any) {
      console.error('Error fetching achievements:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check achievement conditions and grant them if needed
  const checkAndGrantAchievements = async (score: number, streak: number) => {
    if (!session.user) return;
    
    try {
      // Call an edge function or RPC to handle achievement granting
      const { data, error } = await supabase.functions.invoke('update_achievements', {
        body: {
          user_id: session.user.id,
          score,
          streak
        }
      });
      
      if (error) throw error;
      
      if (data?.newAchievements?.length > 0) {
        // Show a toast for each new achievement
        data.newAchievements.forEach((achievement: any) => {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: achievement.name,
            className: "achievement-toast",
          });
        });
        
        // Refresh achievements list
        fetchAchievements();
      }
    } catch (error: any) {
      console.error('Error granting achievements:', error.message);
      setError(error.message);
    }
  };

  // Fetch achievements on component mount or when user logs in
  useEffect(() => {
    if (session.user && !session.loading) {
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [session.user, session.loading]);

  return { 
    achievements, 
    userAchievements,
    loading, 
    error,
    fetchAchievements, 
    checkAndGrantAchievements 
  };
}
