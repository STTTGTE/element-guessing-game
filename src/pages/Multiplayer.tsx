import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search, Users, UserPlus, ArrowLeft } from "lucide-react";

export default function Multiplayer() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("find");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
      fetchActiveGames();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    if (!session?.user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setUserProfile(data);
      } else {
        // Create a profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            avatar_url: null
          })
          .select()
          .single();
          
        if (createError) throw createError;
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    }
  };

  const fetchActiveGames = async () => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multiplayer_games')
        .select('*')
        .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
        .eq('is_active', true);
        
      if (error) throw error;
      
      // Fetch player profiles separately
      if (data && data.length > 0) {
        const playerIds = data.flatMap(game => [
          game.player1_id, 
          game.player2_id
        ].filter(Boolean));
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', playerIds);
          
        if (profilesError) throw profilesError;
        
        // Map profiles to games
        const gamesWithProfiles = data.map(game => {
          const player1Profile = profiles?.find(p => p.id === game.player1_id);
          const player2Profile = game.player2_id ? profiles?.find(p => p.id === game.player2_id) : null;
          
          return {
            ...game,
            player1: player1Profile,
            player2: player2Profile
          };
        });
        
        setActiveGames(gamesWithProfiles);
      } else {
        setActiveGames([]);
      }
    } catch (error) {
      console.error('Error fetching active games:', error);
      toast({
        title: "Error",
        description: "Failed to load active games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchPlayers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchQuery}%`)
        .neq('id', session?.user?.id)
        .limit(10);
        
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching players:', error);
      toast({
        title: "Error",
        description: "Failed to search players",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (opponentId: string) => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multiplayer_games')
        .insert({
          player1_id: session.user.id,
          player2_id: opponentId,
          player1_score: 0,
          player2_score: 0,
          player1_errors: 0,
          player2_errors: 0,
          current_question_index: 0,
          is_active: true,
          time_remaining: 60,
          status: 'waiting'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Game Created",
        description: "Waiting for opponent to join...",
      });
      
      // Navigate to the game
      navigate(`/game/multiplayer/${data.id}`);
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('multiplayer_games')
        .update({
          player2_id: session.user.id,
          status: 'active'
        })
        .eq('id', gameId);
        
      if (error) throw error;
      
      toast({
        title: "Joined Game",
        description: "Game is starting...",
      });
      
      // Navigate to the game
      navigate(`/game/multiplayer/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      toast({
        title: "Error",
        description: "Failed to join game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Multiplayer</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="find">Find Players</TabsTrigger>
              <TabsTrigger value="active">Active Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="find" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Find Players</CardTitle>
                  <CardDescription>
                    Search for players to challenge in a multiplayer game
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search by username</Label>
                      <div className="flex">
                        <Input
                          id="search"
                          placeholder="Enter username"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && searchPlayers()}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={searchPlayers}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {searchResults.length > 0 ? (
                      searchResults.map((player) => (
                        <Card key={player.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarFallback>
                                  {player.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{player.username}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => createGame(player.id)}
                              disabled={loading}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Challenge
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No players found" : "Search for players to challenge"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Games</CardTitle>
                  <CardDescription>
                    Your ongoing multiplayer games
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : activeGames.length > 0 ? (
                    <div className="space-y-4">
                      {activeGames.map((game) => (
                        <Card key={game.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-center">
                                  <Avatar>
                                    <AvatarFallback>
                                      {game.player1?.username?.charAt(0).toUpperCase() || '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm mt-1">{game.player1?.username || 'Player 1'}</p>
                                  <p className="font-bold">{game.player1_score}</p>
                                </div>
                                
                                <div className="text-2xl font-bold">VS</div>
                                
                                <div className="flex flex-col items-center">
                                  <Avatar>
                                    <AvatarFallback>
                                      {game.player2?.username?.charAt(0).toUpperCase() || '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm mt-1">{game.player2?.username || 'Waiting...'}</p>
                                  <p className="font-bold">{game.player2_score}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end">
                                <p className="text-sm text-muted-foreground">
                                  Status: {game.status}
                                </p>
                                <Button 
                                  className="mt-2"
                                  onClick={() => navigate(`/game/multiplayer/${game.id}`)}
                                >
                                  {game.status === 'waiting' && game.player1_id === session?.user?.id 
                                    ? 'Waiting for opponent' 
                                    : 'Continue Game'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No active games. Find players to start a new game.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-xl">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{userProfile.username}</h3>
                  <p className="text-muted-foreground">Player since {new Date(userProfile.created_at).toLocaleDateString()}</p>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/game')}
              >
                <Users className="h-4 w-4 mr-2" />
                Back to Single Player
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 