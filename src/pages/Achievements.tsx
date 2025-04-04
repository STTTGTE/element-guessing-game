import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAchievements } from "@/hooks/use-achievements";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trophy, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Achievements() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { achievements, loading, fetchAchievements } = useAchievements();
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchAchievements();
      fetchAllAchievements();
    }
  }, [session]);

  const fetchAllAchievements = async () => {
    try {
      setAllLoading(true);
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setAllAchievements(data || []);
    } catch (error) {
      console.error('Error fetching all achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive",
      });
    } finally {
      setAllLoading(false);
    }
  };

  const earnedAchievementIds = achievements.map(a => a.achievement_id);
  const earnedCount = earnedAchievementIds.length;
  const totalCount = allAchievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Achievements</h1>
      </div>

      {!session.user ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg mb-4">You need to be signed in to view your achievements.</p>
            <Button onClick={() => navigate('/game?mode=login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                Achievement Progress
              </CardTitle>
              <CardDescription>
                Track your progress and unlock new achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{earnedCount} / {totalCount}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {progressPercentage}% Complete
                </p>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Achievements</h2>
            
            {allLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAchievements.map((achievement) => {
                  const isEarned = earnedAchievementIds.includes(achievement.id);
                  const earnedAchievement = achievements.find(a => a.achievement_id === achievement.id);
                  
                  return (
                    <Card key={achievement.id} className={isEarned ? 'border-primary' : 'opacity-70'}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isEarned ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {isEarned ? (
                              <Trophy className="h-6 w-6" />
                            ) : (
                              <Lock className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {isEarned && earnedAchievement && (
                              <p className="text-xs text-primary mt-2">
                                Earned on {new Date(earnedAchievement.earned_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/game')}
            >
              Play to Earn More Achievements
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 