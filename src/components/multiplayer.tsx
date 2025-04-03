
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ElementData, Question } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import PeriodicTable from "./PeriodicTable";
import QuestionPanel from "./QuestionPanel";
import { Button } from "./ui/button";
import { Loader2, Flag } from "lucide-react";
import multiplayerService, { GameState, GameResult } from "./multiplayer/multiplayer-service";
import { GameFinderCard } from "./multiplayer/GameFinderCard";
import { GameLobbyCard } from "./multiplayer/GameLobbyCard";
import { GameResult as GameResultComponent } from "./multiplayer/GameResult";
import { GameStatusBar } from "./multiplayer/GameStatusBar";

export function MultiplayerGame() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(multiplayerService.getInitialState());
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  // Initialize and check for existing game
  useEffect(() => {
    if (!session.user) return;
    
    const checkForExistingGame = async () => {
      try {
        setGameState(prev => ({ ...prev, loading: true }));
        
        const { matchmaking, match } = await multiplayerService.checkExistingGame(session.user!.id);
        
        if (matchmaking) {
          // User is in matchmaking
          setGameState(prev => ({
            ...prev,
            matchmakingId: matchmaking.id,
            isSearching: true,
            loading: false
          }));
          
          // Set up listeners for matchmaking updates
          setupMatchmakingListeners();
        } else if (match) {
          // User is in a match
          joinGame(match.id);
        } else {
          // User is not in a game
          setGameState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error checking for existing games:", error);
        setGameState(prev => ({
          ...prev,
          error: "Could not check game status. Please try again.",
          loading: false
        }));
      }
    };
    
    checkForExistingGame();
    
    return () => {
      multiplayerService.unsubscribeFromChannel();
    };
  }, [session.user]);

  // Set up listeners for matchmaking
  const setupMatchmakingListeners = () => {
    if (!session.user) return;
    
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
          if (payload.eventType === 'DELETE') {
            // Check if user has been matched
            try {
              const { match } = await multiplayerService.checkExistingGame(session.user!.id);
              
              if (match) {
                // User was matched, join the game
                joinGame(match.id);
              } else {
                // Matchmaking was cancelled
                setGameState(prev => ({
                  ...prev,
                  isSearching: false,
                  matchmakingId: null
                }));
              }
            } catch (error) {
              console.error("Error checking for match after matchmaking update:", error);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Find a game
  const findGame = async () => {
    if (!session.user) return;
    
    try {
      setGameState(prev => ({ ...prev, loading: true, error: null }));
      
      const matchmakingId = await multiplayerService.startMatchmaking(session.user.id);
      
      setGameState(prev => ({
        ...prev,
        isSearching: true,
        matchmakingId,
        loading: false
      }));
      
      setupMatchmakingListeners();
      
      toast({
        title: "Matchmaking Started",
        description: "Looking for an opponent...",
      });
    } catch (error) {
      console.error("Error starting matchmaking:", error);
      setGameState(prev => ({
        ...prev,
        error: "Failed to start matchmaking. Please try again.",
        loading: false
      }));
    }
  };

  // Join an existing game
  const joinGame = async (gameId: string) => {
    if (!session.user) return;
    
    try {
      setGameState(prev => ({ ...prev, loading: true }));
      
      const matchData = await multiplayerService.joinGame(gameId);
      
      // Parse current question from JSON if needed
      let currentQuestion: Question;
      try {
        currentQuestion = typeof matchData.current_question === 'string'
          ? JSON.parse(matchData.current_question as string)
          : matchData.current_question as unknown as Question;
      } catch (e) {
        // Fallback to random question if parsing fails
        currentQuestion = multiplayerService.getRandomQuestion();
      }
      
      // Parse scores from JSON if needed
      let scores: Record<string, number>;
      try {
        scores = typeof matchData.scores === 'string'
          ? JSON.parse(matchData.scores as string)
          : matchData.scores as Record<string, number>;
      } catch (e) {
        scores = {};
      }
      
      // Update game state
      setGameState({
        gameId: matchData.id,
        matchmakingId: null,
        players: [matchData.player1_id, matchData.player2_id],
        currentQuestion,
        scores,
        questionNumber: matchData.question_number,
        isSearching: false,
        error: null,
        loading: false
      });
      
      // Subscribe to game updates
      multiplayerService.subscribeToGameChanges(matchData.id, handleGameUpdate);
      
      toast({
        title: "Game Joined",
        description: "You've joined a multiplayer game!",
      });
    } catch (error) {
      console.error("Error joining game:", error);
      setGameState(prev => ({
        ...prev,
        error: "Failed to join game. Please try again.",
        loading: false
      }));
    }
  };

  // Handle game updates
  const handleGameUpdate = (matchData: any) => {
    // Parse current question from JSON if needed
    let currentQuestion: Question;
    try {
      currentQuestion = typeof matchData.current_question === 'string'
        ? JSON.parse(matchData.current_question)
        : matchData.current_question;
    } catch (e) {
      // Fallback to existing question if parsing fails
      currentQuestion = gameState.currentQuestion || multiplayerService.getRandomQuestion();
    }
    
    // Parse scores from JSON if needed
    let scores: Record<string, number>;
    try {
      scores = typeof matchData.scores === 'string'
        ? JSON.parse(matchData.scores)
        : matchData.scores;
    } catch (e) {
      scores = gameState.scores || {};
    }
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      currentQuestion,
      scores,
      questionNumber: matchData.question_number,
      gameId: matchData.id,
      players: [matchData.player1_id, matchData.player2_id],
      isSearching: false
    }));
    
    // Check if game is completed
    if (matchData.status === 'completed') {
      const userId = session.user?.id || '';
      const opponentId = userId === matchData.player1_id ? matchData.player2_id : matchData.player1_id;
      const userScore = scores[userId] || 0;
      const opponentScore = scores[opponentId] || 0;
      
      // Determine winner
      let winnerId: string | null = null;
      if (userScore > opponentScore) {
        winnerId = userId;
      } else if (opponentScore > userScore) {
        winnerId = opponentId;
      }
      
      // Set game result
      setGameResult({
        winnerId,
        scores,
        isDraw: winnerId === null,
        players: [matchData.player1_id, matchData.player2_id]
      });
      
      if (winnerId === null) {
        toast({
          title: "Game Over",
          description: "The game ended in a draw!",
        });
      } else if (winnerId === userId) {
        toast({
          title: "Victory!",
          description: "Congratulations, you won the game!",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Defeat",
          description: "You lost this match. Better luck next time!",
          variant: "destructive",
        });
      }
    }
  };

  // Cancel matchmaking
  const cancelMatchmaking = async () => {
    if (!session.user) return;
    
    try {
      setGameState(prev => ({ ...prev, loading: true }));
      
      await multiplayerService.cancelMatchmaking(session.user.id);
      
      setGameState(prev => ({
        ...prev,
        isSearching: false,
        matchmakingId: null,
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
        error: "Failed to cancel matchmaking. Please try again.",
        loading: false
      }));
    }
  };

  // Handle element click
  const handleElementClick = async (element: ElementData) => {
    if (!gameState.gameId || !gameState.currentQuestion || !session.user) return;
    
    try {
      setSelectedElement(element);
      
      const isCorrect = await multiplayerService.submitAnswer(
        gameState.gameId,
        session.user.id,
        element,
        gameState.currentQuestion
      );
      
      if (isCorrect) {
        toast({
          title: "Correct!",
          description: `${element.name} (${element.symbol}) is the right answer!`,
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Incorrect!",
          description: "That was not the correct answer.",
          variant: "destructive",
        });
      }
      
      setSelectedElement(null);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
      setSelectedElement(null);
    }
  };

  // Leave game
  const leaveGame = async () => {
    if (!session.user || !gameState.gameId) return;
    
    try {
      // Forfeit the game
      const { error } = await supabase
        .from('matches')
        .update({
          status: 'completed'
        })
        .eq('id', gameState.gameId);
      
      if (error) throw error;
      
      // Clean up
      multiplayerService.unsubscribeFromChannel();
      
      // Reset state
      setGameState(multiplayerService.getInitialState());
      setGameResult(null);
      
      toast({
        title: "Game Left",
        description: "You have forfeited the game",
      });
    } catch (error) {
      console.error("Error leaving game:", error);
      toast({
        title: "Error",
        description: "Failed to leave the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Render loading state
  if (session.loading || gameState.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg">Loading multiplayer game...</p>
      </div>
    );
  }

  // Render error state
  if (gameState.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-lg text-red-500 mb-4">{gameState.error}</p>
        <Button 
          onClick={() => setGameState(prev => ({ ...prev, error: null }))}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Render matchmaking state
  if (gameState.isSearching) {
    return <GameLobbyCard onLeaveGame={cancelMatchmaking} />;
  }

  // Render game result when the game is completed
  if (gameResult) {
    return (
      <GameResultComponent 
        gameResult={gameResult} 
        user={session.user} 
        onPlayAgain={findGame} 
        onLeaveGame={() => {
          setGameState(multiplayerService.getInitialState());
          setGameResult(null);
        }} 
      />
    );
  }

  // Render game finder if no game is in progress
  if (!gameState.gameId) {
    return <GameFinderCard onFindGame={findGame} loading={gameState.loading} />;
  }

  // Render active game
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GameStatusBar 
          gameState={{
            player1_id: gameState.players[0],
            player2_id: gameState.players[1],
            player1_score: gameState.scores[gameState.players[0]] || 0,
            player2_score: gameState.scores[gameState.players[1]] || 0,
            current_question_index: gameState.questionNumber,
            status: 'active'
          }} 
          userId={session.user?.id || ''}
        />
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4 mb-4">
        {gameState.currentQuestion ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Question {gameState.questionNumber + 1}</h2>
            <p>{gameState.currentQuestion.text}</p>
          </div>
        ) : (
          <div className="h-16 w-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-2 sm:p-4 overflow-x-auto">
        <PeriodicTable 
          onElementClick={handleElementClick} 
          selectedElement={selectedElement}
          correctElement={null}
        />
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={leaveGame}
        >
          <Flag className="h-4 w-4" /> Forfeit Game
        </Button>
      </div>
    </div>
  );
}

// Add the import for supabase at the top
import { supabase } from '@/lib/supabase';
