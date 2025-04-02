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
  }>({
    gameId: null,
    players: [],
    currentQuestion: null,
    scores: {},
    questionNumber: 0,
    isSearching: false,
  });

  useEffect(() => {
    if (!session.user) return;

    // Subscribe to game updates
    const gameChannel = supabase.channel('game_updates');
    
    gameChannel
      .on('presence', { event: 'sync' }, () => {
        const state = gameChannel.presenceState();
        const players = Object.keys(state);
        setGameState(prev => ({
          ...prev,
          players
        }));
      })
      .on('broadcast', { event: 'game_action' }, ({ payload }) => {
        setGameState(prev => ({
          ...prev,
          ...payload
        }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await gameChannel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      gameChannel.unsubscribe();
    };
  }, [session.user]);

  const findMatch = async () => {
    if (!session.user) return;

    setGameState(prev => ({ ...prev, isSearching: true }));
    
    try {
      const { data, error } = await supabase
        .from('matchmaking')
        .insert({
          user_id: session.user.id,
          status: 'searching'
        })
        .select()
        .single();

      if (error) throw error;

      // Start checking for match
      const checkMatch = setInterval(async () => {
        const { data: match } = await supabase
          .from('matches')
          .select('*')
          .eq('player1_id', session.user.id)
          .or(`player2_id.eq.${session.user.id}`)
          .single();

        if (match) {
          clearInterval(checkMatch);
          setGameState(prev => ({
            ...prev,
            gameId: match.id,
            isSearching: false,
            currentQuestion: questions[Math.floor(Math.random() * questions.length)],
            scores: {
              [match.player1_id]: 0,
              [match.player2_id]: 0
            }
          }));
        }
      }, 2000);

      // Cleanup after 30 seconds if no match found
      setTimeout(() => {
        clearInterval(checkMatch);
        if (!gameState.gameId) {
          setGameState(prev => ({ ...prev, isSearching: false }));
          toast({
            title: "No match found",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      }, 30000);

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
    if (!gameState.currentQuestion || !gameState.gameId || !session.user) return;

    if (element.symbol === gameState.currentQuestion.correctElement) {
      // Update scores
      const newScores = {
        ...gameState.scores,
        [session.user.id]: (gameState.scores[session.user.id] || 0) + 1
      };

      // Get next question
      const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      setGameState(prev => ({
        ...prev,
        scores: newScores,
        currentQuestion: nextQuestion,
        questionNumber: prev.questionNumber + 1
      }));

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
