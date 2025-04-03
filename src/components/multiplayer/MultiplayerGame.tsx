
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Flag } from "lucide-react";
import { ElementData, Question } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PeriodicTable from "@/components/PeriodicTable";
import multiplayerService from "@/services/multiplayer";
import { MultiplayerGameState, MultiplayerGameResult } from "@/services/multiplayer/types";
import { GameFinderCard } from "./GameFinderCard";
import { GameLobbyCard } from "./GameLobbyCard";
import { GameResult } from "./GameResult";
import { GameStatusBar } from "./GameStatusBar";

export function MultiplayerGame() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [gameResult, setGameResult] = useState<MultiplayerGameResult | null>(null);

  const findGame = async () => {
    if (!session.user) return;
    
    setLoading(true);
    try {
      await multiplayerService.findGame(session.user);
      setCurrentQuestion(multiplayerService.getCurrentQuestion());
    } catch (error) {
      console.error("Error finding game:", error);
      toast({
        title: "Error",
        description: "Failed to find or create a game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const leaveGame = async () => {
    if (!session.user || !gameState) return;
    
    try {
      await multiplayerService.leaveGame(session.user.id);
      setGameState(null);
      setCurrentQuestion(null);
      setGameResult(null);
    } catch (error) {
      console.error("Error leaving game:", error);
    }
  };

  const handleElementClick = async (element: ElementData) => {
    if (!session.user || !gameState || gameState.status !== 'active') return;
    
    setSelectedElement(element);
    const isCorrect = await multiplayerService.answerQuestion(element, session.user.id);
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `${element.name} (${element.symbol}) is the right answer!`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Incorrect!",
        description: `That was not the correct answer.`,
        variant: "destructive",
      });
    }
    
    setCurrentQuestion(multiplayerService.getCurrentQuestion());
    setSelectedElement(null);
  };

  useEffect(() => {
    const unsubscribeState = multiplayerService.subscribeToGameState((state) => {
      setGameState(state);
      setCurrentQuestion(multiplayerService.getCurrentQuestion());
    });
    
    const unsubscribeResult = multiplayerService.subscribeToGameResult((result) => {
      setGameResult(result);
      
      if (result.is_draw) {
        toast({
          title: "Game Over",
          description: "The game ended in a draw!",
          variant: "default",
        });
      } else if (result.winner_id === session.user?.id) {
        toast({
          title: "Victory!",
          description: "Congratulations, you won the game!",
          variant: "default",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          title: "Defeat",
          description: "You lost this match. Better luck next time!",
          variant: "destructive",
        });
      }
    });
    
    return () => {
      unsubscribeState();
      unsubscribeResult();
      multiplayerService.cleanup();
    };
  }, [session.user, toast]);

  // Render finder card when there's no game state
  if (!gameState) {
    return <GameFinderCard onFindGame={findGame} loading={loading} />;
  }

  // Render lobby card when waiting for an opponent
  if (gameState.status === 'waiting') {
    return <GameLobbyCard onLeaveGame={leaveGame} />;
  }

  // Render game result when the game is completed
  if (gameState.status === 'completed' || gameResult) {
    return (
      <GameResult 
        gameResult={gameResult!} 
        user={session.user} 
        onPlayAgain={findGame} 
        onLeaveGame={leaveGame} 
      />
    );
  }

  // Render active game
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <GameStatusBar gameState={gameState} userId={session.user?.id || ''} />
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4 mb-4">
        {currentQuestion ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Question {gameState.current_question_index + 1}</h2>
            <p>{currentQuestion.text}</p>
          </div>
        ) : (
          <Skeleton className="h-16 w-full" />
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
