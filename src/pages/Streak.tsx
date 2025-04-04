import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useStreaks } from "@/hooks/use-streaks";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Loader2, Calendar, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

export default function Streak() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userStreak, loading, fetchUserStreak } = useStreaks();
  const [streakHistory, setStreakHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchUserStreak();
      fetchStreakHistory();
    }
  }, [session]);

  const fetchStreakHistory = async () => {
    if (!session?.user) return;
    
    try {
      setHistoryLoading(true);
      const { data, error } = await supabase
        .from('game_history')
        .select('created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(30);
        
      if (error) throw error;
      
      // Group by date to show daily activity
      const groupedByDate = data.reduce((acc: any, game) => {
        const date = new Date(game.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      }, {});
      
      // Convert to array and sort by date
      const historyArray = Object.entries(groupedByDate).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setStreakHistory(historyArray);
    } catch (error) {
      console.error('Error fetching streak history:', error);
      toast({
        title: "Error",
        description: "Failed to load streak history",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">My Streak</h1>
      </div>

      {!session.user ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg mb-4 text-foreground">You need to be signed in to view your streak.</p>
            <Button onClick={() => navigate('/game?mode=login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Flame className="h-6 w-6 mr-2 text-orange-500" />
                  Current Streak
                </CardTitle>
                <CardDescription>
                  Keep playing daily to maintain your streak!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-500 mb-2">
                      {userStreak?.current_streak || 0}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {userStreak?.current_streak === 0 
                        ? "Start playing to build your streak!" 
                        : `You've played for ${userStreak?.current_streak} day${userStreak?.current_streak === 1 ? '' : 's'} in a row`}
                    </p>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Longest Streak</h3>
                      <div className="text-4xl font-bold text-primary">
                        {userStreak?.max_streak || 0}
                      </div>
                      <p className="text-muted-foreground">
                        {userStreak?.max_streak === 0 
                          ? "Your best streak will appear here" 
                          : "Your best streak so far"}
                      </p>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        size="lg" 
                        onClick={() => navigate('/game')}
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  Activity Calendar
                </CardTitle>
                <CardDescription>
                  Your playing activity over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : streakHistory.length > 0 ? (
                  <div className="space-y-4">
                    {streakHistory.map((day) => (
                      <div key={day.date} className="flex items-center">
                        <div className="w-32 text-sm text-foreground">{formatDate(day.date)}</div>
                        <div className="flex-1">
                          <Progress value={Math.min(day.count * 20, 100)} className="h-2" />
                        </div>
                        <div className="w-12 text-right text-sm font-medium text-foreground">
                          {day.count} {day.count === 1 ? 'game' : 'games'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity recorded yet. Start playing to see your history!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Streak Milestones
                </CardTitle>
                <CardDescription>
                  Achieve these milestones to earn special rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StreakMilestone 
                    days={1} 
                    title="Getting Started" 
                    description="Play for 1 day in a row" 
                    achieved={userStreak?.current_streak >= 1} 
                  />
                  <StreakMilestone 
                    days={3} 
                    title="Consistency" 
                    description="Play for 3 days in a row" 
                    achieved={userStreak?.current_streak >= 3} 
                  />
                  <StreakMilestone 
                    days={7} 
                    title="Weekly Warrior" 
                    description="Play for 7 days in a row" 
                    achieved={userStreak?.current_streak >= 7} 
                  />
                  <StreakMilestone 
                    days={14} 
                    title="Two Week Champion" 
                    description="Play for 14 days in a row" 
                    achieved={userStreak?.current_streak >= 14} 
                  />
                  <StreakMilestone 
                    days={30} 
                    title="Monthly Master" 
                    description="Play for 30 days in a row" 
                    achieved={userStreak?.current_streak >= 30} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function StreakMilestone({ 
  days, 
  title, 
  description, 
  achieved 
}: { 
  days: number; 
  title: string; 
  description: string; 
  achieved: boolean;
}) {
  return (
    <div className={`flex items-center p-3 rounded-md ${achieved ? 'bg-primary/10' : 'bg-muted/30'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${achieved ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {achieved ? <Trophy className="h-4 w-4" /> : days}
      </div>
      <div>
        <h4 className={`font-medium ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
} 