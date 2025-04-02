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
  }>({
    gameId: null,
    players: [],
    currentQuestion: null,
    scores: {},
    questionNumber: 0,
    isSearching: false,
    channel: null,
  });

  useEffect(() => {
    if (!session.user) return;

    // Clean up any existing channel
    if (gameState.channel) {
      gameState.channel.unsubscribe();
    }

    // Create a new channel for the user
    const channel = supabase.channel(`game:${session.user.id}`, {
      config: {
        broadcast: { self: true },
        presence: { key: session.user.id },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
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
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: session.user.id,
          online_at: new Date().toISOString(),
        });
      }
    });

    setGameState(prev => ({ ...prev, channel }));

    return () => {
      channel.unsubscribe();
    };
  }, [session.user]);

  const findMatch = async () => {
    if (!session.user || !gameState.channel) return;

    setGameState(prev => ({ ...prev, isSearching: true }));
    
    try {
      // First, check if there's anyone else searching
      const { data: existingMatch } = await supabase
        .from('matchmaking')
        .select('*')
        .eq('status', 'searching')
        .neq('user_id', session.user.id)
        .single();

      if (existingMatch) {
        // Found a match, create a game
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .insert({
            player1_id: existingMatch.user_id,
            player2_id: session.user.id,
            status: 'active',
            current_question: questions[Math.floor(Math.random() * questions.length)],
            scores: {
              [existingMatch.user_id]: 0,
              [session.user.id]: 0
            }
          })
          .select()
          .single();

        if (matchError) throw matchError;

        // Update the existing matchmaking entry
        await supabase
          .from('matchmaking')
          .update({ status: 'matched' })
          .eq('user_id', existingMatch.user_id);

        // Set up the game state
        const gameUpdate = {
          gameId: match.id,
          isSearching: false,
          currentQuestion: match.current_question,
          scores: match.scores,
          questionNumber: 0
        };

        setGameState(prev => ({
          ...prev,
          ...gameUpdate
        }));

        // Broadcast the game update
        gameState.channel.send({
          type: 'broadcast',
          event: 'game_update',
          payload: gameUpdate
        });

      } else {
        // No match found, create a matchmaking entry
        const { error: matchmakingError } = await supabase
          .from('matchmaking')
          .insert({
            user_id: session.user.id,
            status: 'searching'
          });

        if (matchmakingError) throw matchmakingError;

        // Start checking for matches
        const checkMatch = setInterval(async () => {
          const { data: match } = await supabase
            .from('matches')
            .select('*')
            .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
            .eq('status', 'active')
            .single();

          if (match) {
            clearInterval(checkMatch);
            
            const gameUpdate = {
              gameId: match.id,
              isSearching: false,
              currentQuestion: match.current_question,
              scores: match.scores,
              questionNumber: 0
            };

            setGameState(prev => ({
              ...prev,
              ...gameUpdate
            }));

            // Broadcast the game update
            gameState.channel.send({
              type: 'broadcast',
              event: 'game_update',
              payload: gameUpdate
            });
          }
        }, 2000);

        // Cleanup after 30 seconds if no match found
        setTimeout(() => {
          clearInterval(checkMatch);
          if (!gameState.gameId) {
            setGameState(prev => ({ ...prev, isSearching: false }));
            
            // Clean up matchmaking entry
            supabase
              .from('matchmaking')
              .delete()
              .eq('user_id', session.user.id);

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
      setGameState(prev => ({ ...prev, isSearching: false }));
      toast({
        title: "Error",
        description: "Failed to find match. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleElementClick = async (element: ElementData) => {
    if (!gameState.currentQuestion || !gameState.gameId || !session.user || !gameState.channel) return;

    if (element.symbol === gameState.currentQuestion.correctElement) {
      // Update scores
      const newScores = {
        ...gameState.scores,
        [session.user.id]: (gameState.scores[session.user.id] || 0) + 1
      };

      // Get next question
      const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      const gameUpdate = {
        scores: newScores,
        currentQuestion: nextQuestion,
        questionNumber: gameState.questionNumber + 1
      };

      setGameState(prev => ({
        ...prev,
        ...gameUpdate
      }));

      // Broadcast the game update
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
      await supabase
        .from('matches')
        .update({
          scores: newScores,
          current_question: nextQuestion,
          question_number: gameState.questionNumber + 1
        })
        .eq('id', gameState.gameId);

    } else {
      toast({
        title: "Incorrect!",
        description: `Try again!`,
        variant: "destructive",
      });
    }
  };

  if (!session.user) {
    return (
      <div className="text-center p-4">
        Please sign in to play multiplayer
      </div>
    );
  }

  if (gameState.isSearching) {
    return (
      <div className="text-center p-4">
        <div className="animate-pulse">Searching for opponent...</div>
      </div>
    );
  }

  if (!gameState.gameId) {
    return (
      <div className="text-center p-4">
        <Button onClick={findMatch}>Find Match</Button>
      </div>
    );
  }

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
          </div>
        </div>

        {gameState.currentQuestion ? (
          <QuestionPanel
            question={gameState.currentQuestion}
            questionNumber={gameState.questionNumber}
          />
        ) : (
          <div className="text-center p-4">Loading question...</div>
        )}
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Scores</h3>
        {Object.entries(gameState.scores).map(([playerId, score]) => (
          <div key={playerId} className="flex justify-between items-center mb-2">
            <span>{playerId === session.user?.id ? 'You' : 'Opponent'}</span>
            <span>{score}</span>
          </div>
        ))}
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
