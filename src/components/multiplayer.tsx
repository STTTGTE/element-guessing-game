import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { ElementData, Question } from "@/types/game";
import { questions } from "@/data/questions";
import { elementData } from "@/data/elements";
import PeriodicTable from "./PeriodicTable";
import QuestionPanel from "./QuestionPanel";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function MultiplayerGame() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<{
    gameId: string | null;
    players: string[];
    currentQuestion: Question | null;
    scores: Record<string, number>;
    questionNumber: number;
    isSearching: boolean;
    channel: any;
    error: string | null;
  }>({
    gameId: null,
    players: [],
    currentQuestion: null,
    scores: {},
    questionNumber: 0,
    isSearching: false,
    channel: null,
    error: null
  });

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

    // Clean up any existing channel
    if (gameState.channel) {
      gameState.channel.unsubscribe();
    }

    try {
      // Create a new channel for the user
      console.log("Creating realtime channel for user:", session.user.id);
      const channel = supabase.channel(`game:${session.user.id}`, {
        config: {
          broadcast: { self: true },
          presence: { key: session.user.id },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          console.log("Presence sync event received");
          const state = channel.presenceState();
          console.log("Presence state:", state);
          const players = Object.keys(state);
          setGameState(prev => ({
            ...prev,
            players
          }));
        })
        .on('broadcast', { event: 'game_update' }, ({ payload }) => {
          console.log('Received game update:', payload);
          setGameState(prev => ({
            ...prev,
            ...payload,
          }));
        });

      channel.subscribe(async (status) => {
        console.log("Channel subscription status:", status);
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
          });
        } else if (status === 'CHANNEL_ERROR') {
          console.error("Error subscribing to channel");
          setGameState(prev => ({ ...prev, error: "Failed to connect to multiplayer service" }));
        }
      });

      setGameState(prev => ({ ...prev, channel, error: null }));
    } catch (error) {
      console.error("Error setting up realtime:", error);
      setGameState(prev => ({ ...prev, error: "Failed to initialize multiplayer" }));
    }

    // Check if user is already in a match
    const checkExistingMatch = async () => {
      try {
        console.log("Checking for existing match");
        const { data: match, error } = await supabase
          .from('matches')
          .select('*')
          .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
          .eq('status', 'active')
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Error checking existing match:", error);
          }
          return;
        }

        if (match) {
          console.log("Found existing match:", match);
          setGameState(prev => ({
            ...prev,
            gameId: match.id,
            isSearching: false,
            currentQuestion: match.current_question,
            scores: match.scores || {},
            questionNumber: match.question_number || 0
          }));
        }
      } catch (error) {
        console.error("Error checking existing match:", error);
      }
    };

    checkExistingMatch();

    return () => {
      console.log("Cleaning up multiplayer component");
      if (gameState.channel) {
        gameState.channel.unsubscribe();
      }
    };
  }, [session.user, session.loading]);

  const findMatch = async () => {
    if (!session.user || !gameState.channel) {
      toast({
        title: "Error",
        description: "Please sign in to play multiplayer",
        variant: "destructive"
      });
      return;
    }

    console.log("Finding match for user:", session.user.id);
    setGameState(prev => ({ ...prev, isSearching: true, error: null }));
    
    try {
      // First, check if there's anyone else searching
      console.log("Checking for existing matchmaking entries");
      const { data: existingMatch, error: searchError } = await supabase
        .from('matchmaking')
        .select('*')
        .eq('status', 'searching')
        .neq('user_id', session.user.id)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        console.error("Error searching for match:", searchError);
        throw searchError;
      }

      if (existingMatch) {
        console.log("Found potential match:", existingMatch);
        // Found a match, create a game
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        console.log("Selected random question:", randomQuestion);
        
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .insert({
            player1_id: existingMatch.user_id,
            player2_id: session.user.id,
            status: 'active',
            current_question: randomQuestion,
            scores: {
              [existingMatch.user_id]: 0,
              [session.user.id]: 0
            }
          })
          .select()
          .single();

        if (matchError) {
          console.error("Error creating match:", matchError);
          throw matchError;
        }

        console.log("Match created:", match);

        // Update the existing matchmaking entry
        const { error: updateError } = await supabase
          .from('matchmaking')
          .update({ status: 'matched' })
          .eq('user_id', existingMatch.user_id);

        if (updateError) {
          console.error("Error updating matchmaking entry:", updateError);
        }

        // Set up the game state
        const gameUpdate = {
          gameId: match.id,
          isSearching: false,
          currentQuestion: match.current_question,
          scores: match.scores,
          questionNumber: 0
        };

        console.log("Setting game state:", gameUpdate);
        setGameState(prev => ({
          ...prev,
          ...gameUpdate
        }));

        // Broadcast the game update
        console.log("Broadcasting game update");
        gameState.channel.send({
          type: 'broadcast',
          event: 'game_update',
          payload: gameUpdate
        });

      } else {
        console.log("No existing match found, creating matchmaking entry");
        // No match found, create a matchmaking entry
        const { error: matchmakingError } = await supabase
          .from('matchmaking')
          .insert({
            user_id: session.user.id,
            status: 'searching'
          });

        if (matchmakingError) {
          console.error("Error creating matchmaking entry:", matchmakingError);
          throw matchmakingError;
        }

        // Start checking for matches
        console.log("Starting match check interval");
        const checkMatch = setInterval(async () => {
          console.log("Checking for new match");
          const { data: match, error: matchCheckError } = await supabase
            .from('matches')
            .select('*')
            .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
            .eq('status', 'active')
            .single();

          if (matchCheckError && matchCheckError.code !== 'PGRST116') {
            console.error("Error checking for match:", matchCheckError);
            return;
          }

          if (match) {
            console.log("Match found:", match);
            clearInterval(checkMatch);
            
            const gameUpdate = {
              gameId: match.id,
              isSearching: false,
              currentQuestion: match.current_question,
              scores: match.scores || {},
              questionNumber: match.question_number || 0
            };

            console.log("Setting game state from new match:", gameUpdate);
            setGameState(prev => ({
              ...prev,
              ...gameUpdate
            }));

            // Broadcast the game update
            console.log("Broadcasting game update for new match");
            gameState.channel.send({
              type: 'broadcast',
              event: 'game_update',
              payload: gameUpdate
            });
          }
        }, 2000);

        // Cleanup after 30 seconds if no match found
        setTimeout(() => {
          console.log("Matchmaking timeout check");
          clearInterval(checkMatch);
          
          // Check if we're still searching
          if (gameState.isSearching) {
            console.log("No match found after timeout");
            setGameState(prev => ({ ...prev, isSearching: false }));
            
            // Clean up matchmaking entry
            console.log("Cleaning up matchmaking entry");
            supabase
              .from('matchmaking')
              .delete()
              .eq('user_id', session.user.id)
              .then(({ error }) => {
                if (error) {
                  console.error("Error deleting matchmaking entry:", error);
                }
              });

            toast({
              title: "No match found",
              description: "Please try again later",
              variant: "destructive"
            });
          }
        }, 30000);
      }

    } catch (error) {
      console.error('Error finding match:', error);
      setGameState(prev => ({ 
        ...prev, 
        isSearching: false,
        error: "Failed to find a match. Please try again."
      }));
      toast({
        title: "Error",
        description: "Failed to find match. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleElementClick = async (element: ElementData) => {
    if (!gameState.currentQuestion || !gameState.gameId || !session.user || !gameState.channel) {
      console.log("Cannot handle element click, prerequisites not met");
      return;
    }

    console.log("Element clicked:", element, "Correct element:", gameState.currentQuestion.correctElement);
    if (element.symbol === gameState.currentQuestion.correctElement) {
      // Update scores
      const newScores = {
        ...gameState.scores,
        [session.user.id]: (gameState.scores[session.user.id] || 0) + 1
      };

      // Get next question
      const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
      console.log("Selected next question:", nextQuestion);
      
      const gameUpdate = {
        scores: newScores,
        currentQuestion: nextQuestion,
        questionNumber: gameState.questionNumber + 1
      };

      console.log("Updating game state for correct answer:", gameUpdate);
      setGameState(prev => ({
        ...prev,
        ...gameUpdate
      }));

      // Broadcast the game update
      console.log("Broadcasting game update for correct answer");
      gameState.channel.send({
        type: 'broadcast',
        event: 'game_update',
        payload: gameUpdate
      });

      toast({
        title: "Correct!",
        description: `${element.name} (${element.symbol}) is the right answer!`,
        variant: "default",
        className: "bg-green-500 text-white",
      });

      // Update game state in database
      console.log("Updating match in database");
      await supabase
        .from('matches')
        .update({
          scores: newScores,
          current_question: nextQuestion,
          question_number: gameState.questionNumber + 1
        })
        .eq('id', gameState.gameId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating match:", error);
          }
        });

    } else {
      toast({
        title: "Incorrect!",
        description: `Try again!`,
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (session.loading) {
    return (
      <div className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading multiplayer...</p>
      </div>
    );
  }

  // Error state
  if (gameState.error) {
    return (
      <div className="text-center p-8">
        <div className="text-destructive mb-4">{gameState.error}</div>
        <Button onClick={() => setGameState(prev => ({ ...prev, error: null }))}>
          Try Again
        </Button>
      </div>
    );
  }

  // Not logged in
  if (!session.user) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Please sign in to play multiplayer</p>
      </div>
    );
  }

  // Searching for opponent
  if (gameState.isSearching) {
    return (
      <div className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <div className="mb-4">Searching for opponent...</div>
        <Button 
          variant="outline" 
          onClick={() => {
            setGameState(prev => ({ ...prev, isSearching: false }));
            // Clean up matchmaking entry
            supabase
              .from('matchmaking')
              .delete()
              .eq('user_id', session.user.id);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Ready to start matching
  if (!gameState.gameId) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Ready to challenge another player?</p>
        <Button onClick={findMatch} size="lg">Find Match</Button>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Players:</h3>
          <div className="flex gap-2">
            {gameState.players.map(playerId => (
              <div key={playerId} className="px-3 py-1 bg-primary/10 rounded">
                {playerId === session.user?.id ? 'You' : 'Opponent'}
              </div>
            ))}
            {gameState.players.length === 0 && (
              <div className="px-3 py-1 bg-muted rounded">
                Waiting for players to connect...
              </div>
            )}
          </div>
        </div>

        {gameState.currentQuestion ? (
          <QuestionPanel
            question={gameState.currentQuestion}
            questionNumber={gameState.questionNumber}
          />
        ) : (
          <div className="text-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading question...</p>
          </div>
        )}
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Scores</h3>
        {Object.entries(gameState.scores).length > 0 ? (
          Object.entries(gameState.scores).map(([playerId, score]) => (
            <div key={playerId} className="flex justify-between items-center mb-2">
              <span>{playerId === session.user?.id ? 'You' : 'Opponent'}</span>
              <span>{score}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No scores yet</p>
        )}
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-md p-2 sm:p-4 overflow-x-auto">
        <PeriodicTable
          onElementClick={handleElementClick}
          selectedElement={null}
          correctElement={gameState.currentQuestion?.correctElement}
        />
      </div>
    </div>
  );
}
