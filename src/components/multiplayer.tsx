import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { ElementData, Question, TableVariant, GameMode } from "@/types/game";
import { questions } from "@/data/questions";
import { elementData } from "@/data/elements";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, RefreshCw } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ThemeSelector from "@/components/ThemeSelector";
import { GameStatusBar } from "./multiplayer/GameStatusBar";
import { GameResult } from "./multiplayer/GameResult";
import { MultiplayerGameState, MultiplayerGameResult } from '@/services/multiplayer/types';

interface GameState {
  gameId: string | null;
  players: string[];
  currentQuestion: Question | null;
  scores: Record<string, number>;
  questionNumber: number;
  isSearching: boolean;
  error: string | null;
  loading: boolean;
  status: 'active' | 'completed' | 'waiting';
}

interface MultiplayerGameProps {
  onBack: () => void;
}

export function MultiplayerGame({ onBack }: MultiplayerGameProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('standard');
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);

  // Function to join an existing game - wrapped in useCallback to avoid dependency issues
  const joinExistingGame = useCallback(async (gameId: string) => {
    if (!session.user) return;
    
    try {
      console.log("Joining existing game:", gameId);
      
      // Get game data
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', gameId)
        .single();
      
      if (error) {
        console.error("Error getting game data:", error);
        throw error;
      }
      
      console.log("Game data:", data);
      
      // Subscribe to game updates
      const channel = supabase
        .channel(`match-${gameId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'matches',
            filter: `id=eq.${gameId}`
          },
          (payload) => {
            console.log("Game update received:", payload);
            
            if (payload.eventType === 'UPDATE') {
              const newData = payload.new;
              
              // Parse JSON data from database
              const currentQuestion = typeof newData.current_question === 'string' 
                ? JSON.parse(newData.current_question) 
                : newData.current_question;
                
              const scores = typeof newData.scores === 'string'
                ? (newData.scores === '[object Object]' ? {} : JSON.parse(newData.scores))
                : newData.scores;
              
              // Ensure players array is properly initialized
              const players = [newData.player1_id, newData.player2_id].filter(Boolean);
              
              setGameState(prev => ({
                ...prev,
                currentQuestion: currentQuestion as Question,
                scores: scores as Record<string, number>,
                questionNumber: newData.question_number,
                gameId: newData.id,
                players,
                isSearching: false,
                status: newData.status as 'active' | 'completed' | 'waiting'
              }));
              
              if (newData.status === 'completed') {
                // Game is over
                const userId = session.user.id;
                const userScore = scores[userId] || 0;
                const opponentId = userId === newData.player1_id ? newData.player2_id : newData.player1_id;
                const opponentScore = scores[opponentId] || 0;
                
                let resultMessage = "Game over! ";
                if (userScore > opponentScore) {
                  resultMessage += "You won!";
                } else if (userScore < opponentScore) {
                  resultMessage += "You lost!";
                } else {
                  resultMessage += "It's a tie!";
                }
                
                toast({
                  title: "Game Completed",
                  description: resultMessage,
                });
                
                // Reset game state after a delay
                setTimeout(() => {
                  setGameState({
                    gameId: null,
                    players: [],
                    currentQuestion: null,
                    scores: {},
                    questionNumber: 0,
                    isSearching: false,
                    error: null,
                    loading: false,
                    status: 'completed'
                  });
                }, 3000);
              }
            }
          }
        )
        .subscribe();
      
      // Store channel in ref
      channelRef.current = channel;
      
      // Parse JSON data from database
      const currentQuestion = typeof data.current_question === 'string' 
        ? JSON.parse(data.current_question) 
        : data.current_question;
        
      const scores = typeof data.scores === 'string'
        ? (data.scores === '[object Object]' ? {} : JSON.parse(data.scores))
        : data.scores;
      
      // Ensure players array is properly initialized
      const players = [data.player1_id, data.player2_id].filter(Boolean);
      
      // Update game state
      setGameState({
        gameId: data.id,
        players,
        currentQuestion: currentQuestion as Question,
        scores: scores as Record<string, number>,
        questionNumber: data.question_number,
        isSearching: false,
        error: null,
        loading: false,
        status: data.status as 'active' | 'completed' | 'waiting'
      });
      
      toast({
        title: "Game Joined",
        description: "You have joined a multiplayer game!",
      });
    } catch (error) {
      console.error("Error joining game:", error);
      setGameState(prev => ({ 
        ...prev, 
        error: "Error joining game. Please try again.",
        isSearching: false,
        loading: false
      }));
    }
  }, [session.user, toast]);

  // Subscribe to matchmaking changes
  const subscribeToMatchmaking = useCallback(() => {
    if (!session.user) return;
    
    console.log("Subscribing to matchmaking changes");
    
    const channel = supabase
      .channel('matchmaking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matchmaking',
          filter: `user_id=eq.${session.user.id}`
        },
        async (payload) => {
          console.log("Matchmaking update received:", payload);
          
          if (payload.eventType === 'DELETE') {
            // Check if user has been matched
            const { data, error } = await supabase
              .from('matches')
              .select('*')
              .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
              .eq('status', 'active')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (error) {
              console.error("Error checking for new match:", error);
              return;
            }
            
            if (data) {
              console.log("Match found:", data);
              joinExistingGame(data.id);
            } else {
              // If matchmaking was deleted but no match was found, reset state
              setGameState(prev => ({ 
                ...prev, 
                isSearching: false,
                error: "Matchmaking was cancelled"
              }));
            }
          }
        }
      )
      .subscribe();
    
    // Store channel in ref
    channelRef.current = channel;
  }, [session.user, joinExistingGame]);

  // Initialize the game component
  useEffect(() => {
    console.log("Multiplayer component mounted");
    
    // Show the current session state
    console.log("Current session:", session);
    
    if (session.loading) {
      console.log("Session is still loading");
      return;
    }

    if (!session.user) {
      console.log("No user is logged in");
      setGameState(prev => ({ ...prev, error: "Please sign in to play multiplayer" }));
      return;
    }

    // Check if user is already in a game
    const checkExistingGame = async () => {
      try {
        setGameState(prev => ({ ...prev, loading: true }));
        
        // First check matchmaking
        const { data: matchmakingData, error: matchmakingError } = await supabase
          .from('matchmaking')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (matchmakingError) {
          console.error("Error checking matchmaking:", matchmakingError);
        }
        
        if (matchmakingData) {
          console.log("User is already in matchmaking:", matchmakingData);
          setGameState(prev => ({ 
            ...prev, 
            isSearching: true,
            loading: false
          }));
          
          // Subscribe to matchmaking changes
          subscribeToMatchmaking();
          return;
        }
        
        // Then check active matches
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
          .eq('status', 'active')
          .maybeSingle();
        
        if (matchesError) {
          console.error("Error checking matches:", matchesError);
        }
        
        if (matchesData) {
          console.log("User is already in a match:", matchesData);
          joinExistingGame(matchesData.id);
          return;
        }
        
        setGameState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        console.error("Error checking existing game:", error);
        setGameState(prev => ({ 
          ...prev, 
          error: error.message || "Error checking game status. Please try again.",
          loading: false
        }));
      }
    };
    
    checkExistingGame();
    
    return () => {
      // Clean up any subscriptions
      if (channelRef.current) {
        console.log("Unsubscribing from channel");
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [session, subscribeToMatchmaking, joinExistingGame]);

  const startMatchmaking = async () => {
    if (!session.user) {
      setGameState(prev => ({ ...prev, error: "Please sign in to play multiplayer" }));
      return;
    }
    
    try {
      setGameState(prev => ({ ...prev, isSearching: true, loading: true, error: null }));
      
      // Create matchmaking entry
      const { data, error } = await supabase
        .from('matchmaking')
        .insert({
          user_id: session.user.id,
          status: 'searching'
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error starting matchmaking:", error);
        throw error;
      }
      
      console.log("Matchmaking started:", data);
      
      // Subscribe to matchmaking changes
      subscribeToMatchmaking();
      
      setGameState(prev => ({ ...prev, loading: false }));
      
      toast({
        title: "Matchmaking Started",
        description: "Looking for an opponent...",
      });
    } catch (error) {
      console.error("Error in matchmaking:", error);
      setGameState(prev => ({ 
        ...prev, 
        error: error.message || "Error starting matchmaking. Please try again.",
        isSearching: false,
        loading: false
      }));
    }
  };

  const cancelMatchmaking = async () => {
    if (!session.user) return;
    
    try {
      setGameState(prev => ({ ...prev, loading: true }));
      
      // Delete matchmaking entry
      const { error } = await supabase
        .from('matchmaking')
        .delete()
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error("Error cancelling matchmaking:", error);
        throw error;
      }
      
      console.log("Matchmaking cancelled");
      
      // Unsubscribe from channel
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      
      setGameState(prev => ({ 
        ...prev, 
        isSearching: false, 
        error: null,
        loading: false
      }));
      
      toast({
        title: "Matchmaking Cancelled",
        description: "You have cancelled matchmaking",
      });
    } catch (error) {
      console.error("Error cancelling matchmaking:", error);
      setGameState(prev => ({ 
        ...prev, 
        error: "Error cancelling matchmaking. Please try again.",
        loading: false
      }));
    }
  };

  const handleElementClick = async (element: ElementData) => {
    if (!gameState || gameState.status !== 'active') return;
    
    // Update score based on correct/incorrect answer
    const newScore = gameState.player1_score + 10;
    
    // Update game state
    setGameState(prev => prev ? {
      ...prev,
      player1_score: newScore
    } : null);
  };

  // Render loading state
  if (session.loading || gameState?.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg">Loading multiplayer game...</p>
      </div>
    );
  }

  // Render error state
  if (gameState?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-lg text-red-500 mb-4">{gameState.error}</p>
        <Button onClick={() => setGameState(prev => ({ ...prev, error: null }))}>
          Try Again
        </Button>
      </div>
    );
  }

  // Render matchmaking state
  if (gameState?.isSearching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg mb-4">Searching for an opponent...</p>
        <Button 
          variant="destructive" 
          onClick={cancelMatchmaking}
          disabled={gameState.loading}
        >
          {gameState.loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cancelling...
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      </div>
    );
  }

  // Render game result when the game is completed
  if (gameState?.status === 'completed') {
    return (
      <GameResult 
        gameResult={gameState} 
        user={session.user} 
        onPlayAgain={startMatchmaking} 
        onLeaveGame={cancelMatchmaking} 
      />
    );
  }

  // Render the active game
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Multiplayer Game</CardTitle>
          <CardDescription>
            {gameState?.status === 'waiting' ? 'Waiting for opponent...' :
             gameState?.status === 'active' ? 'Game in progress' :
             gameState?.status === 'completed' ? 'Game completed' : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <p>Your Score: {gameState?.player1_score || 0}</p>
              <p>Opponent Score: {gameState?.player2_score || 0}</p>
            </div>
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </div>
        </CardContent>
      </Card>

      {gameState?.status === 'completed' ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="mb-4">
            {gameState.player1_score > (gameState.player2_score || 0)
              ? 'You won!'
              : gameState.player1_score === gameState.player2_score
              ? "It's a tie!"
              : 'You lost!'}
          </p>
          <Button onClick={onBack}>Back to Menu</Button>
        </div>
      ) : (
        <PeriodicTable
          onElementClick={handleElementClick}
          highlightedElements={[]}
          variant={currentTheme}
          showDetails={true}
        />
      )}
    </div>
  );
}
