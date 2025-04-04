import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { UserAchievement, Achievement } from '@/lib/supabase';

export function useAchievements() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user achievements from the database
  const fetchAchievements = async () => {
    if (!session.user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          user_id,
          achievement_id,
          earned_at,
          achievement:achievements (
            id,
            name,
            description,
            icon,
            created_at
          )
        `)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Transform the data to match UserAchievement type
      const transformedData = (data || []).map(item => ({
        ...item,
        achievement: item.achievement as unknown as Achievement
      }));
      
      setAchievements(transformedData);
    } catch (error: any) {
      console.error('Error fetching achievements:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch achievements. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check achievement conditions and grant them if needed
  const checkAndGrantAchievements = async (score: number, streak: number) => {
    if (!session.user) return;
    
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.access_token) {
        throw new Error('No access token available');
      }

      const { data, error } = await supabase.functions.invoke('update_achievements', {
        body: { score, streak },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`
        }
      });
      
      if (error) {
        console.error('Error calling update_achievements:', error);
        throw error;
      }
      
      if (data?.newAchievements?.length > 0) {
        // Show a toast for each new achievement
        data.newAchievements.forEach((achievement: Achievement) => {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: achievement.name,
            className: "achievement-toast",
          });
        });
        
        // Refresh achievements list
        await fetchAchievements();
      }
    } catch (error: any) {
      console.error('Error granting achievements:', error.message);
      // Don't show error toast to user as this is a background operation
    }
  };

  // Fetch achievements on component mount or when user logs in
  useEffect(() => {
    if (session.user && !session.loading) {
      fetchAchievements();
    }
  }, [session.user, session.loading]);

  return { 
    achievements, 
    loading, 
    fetchAchievements, 
    checkAndGrantAchievements 
  };
}
