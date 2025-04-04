import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (session?.user) {
      fetchGameHistory();
    } else {
      setLoading(false);
    }
  }, [session, activeTab]);

  const fetchGameHistory = async () => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('game_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (activeTab !== 'all') {
        query = query.eq('game_mode', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setGameHistory(data || []);
    } catch (error) {
      console.error('Error fetching game history:', error);
      toast({
        title: "Error",
        description: "Failed to load game history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Game History</h1>
      </div>

      {!session.user ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg mb-4">You need to be signed in to view your game history.</p>
            <Button onClick={() => navigate('/game?mode=login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="single">Single Player</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <GameHistoryContent 
              loading={loading} 
              gameHistory={gameHistory} 
              formatDate={formatDate} 
            />
          </TabsContent>
          
          <TabsContent value="single" className="mt-0">
            <GameHistoryContent 
              loading={loading} 
              gameHistory={gameHistory} 
              formatDate={formatDate} 
            />
          </TabsContent>
          
          <TabsContent value="multiplayer" className="mt-0">
            <GameHistoryContent 
              loading={loading} 
              gameHistory={gameHistory} 
              formatDate={formatDate} 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function GameHistoryContent({ 
  loading, 
  gameHistory, 
  formatDate 
}: { 
  loading: boolean; 
  gameHistory: any[]; 
  formatDate: (date: string) => string;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (gameHistory.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg">No game history found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gameHistory.map((game) => (
        <Card key={game.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {game.game_mode === 'multiplayer' ? 'Multiplayer Game' : 'Single Player Game'}
              </CardTitle>
              {game.game_mode === 'multiplayer' ? (
                <Users className="h-5 w-5 text-primary" />
              ) : (
                <Trophy className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardDescription>
              {formatDate(game.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-xl font-bold">{game.score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-xl font-bold">{game.total_questions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 