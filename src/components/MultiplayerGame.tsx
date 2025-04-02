
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import PeriodicTable from "@/components/PeriodicTable";
import { ElementData, Question } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, Swords, Clock, Shield } from "lucide-react";
import multiplayerService, { MultiplayerGameState, MultiplayerGameResult } from "@/services/multiplayer-service";

export function MultiplayerGame() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<MultiplayerGameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [gameResult, setGameResult] = useState<MultiplayerGameResult | null>(null);

  // Find or create a game
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

  // Leave the current game
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

  // Handle element selection
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

  // Setup listeners for game state and results
  useEffect(() => {
    const unsubscribeState = multiplayerService.subscribeToGameState((state) => {
      setGameState(state);
      setCurrentQuestion(multiplayerService.getCurrentQuestion());
    });
    
    const unsubscribeResult = multiplayerService.subscribeToGameResult((result) => {
      setGameResult(result);
      
      // Show toast with game result
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

  // Determine if the user is player 1 or 2
  const isPlayer1 = gameState?.player1_id === session.user?.id;

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render different views based on game state
  if (!gameState) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Multiplayer Mode</CardTitle>
            <CardDescription>
              Challenge other players in real-time!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-md p-4">
              <h3 className="font-bold flex items-center gap-2">
                <Swords className="h-5 w-5" /> Game Rules
              </h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>You have 3 minutes to answer as many questions as possible</li>
                <li>3 incorrect answers and you lose automatically</li>
                <li>Player with the most correct answers wins</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={findGame} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? "Finding Match..." : "Find Match"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (gameState.status === 'waiting') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Waiting for Opponent</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="flex space-x-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <p className="text-center text-muted-foreground max-w-md">
              Searching for an opponent. This could take a moment...
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={leaveGame} 
              variant="outline" 
              className="w-full"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (gameState.status === 'completed' || gameResult) {
    const userScore = isPlayer1 ? gameResult?.player1_score : gameResult?.player2_score;
    const opponentScore = isPlayer1 ? gameResult?.player2_score : gameResult?.player1_score;
    const userWon = gameResult?.winner_id === session.user?.id;
    const isDraw = gameResult?.is_draw;
    
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader className={`${userWon ? 'bg-green-100 dark:bg-green-900/20' : isDraw ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {userWon ? (
                <>🏆 Victory!</>
              ) : isDraw ? (
                <>🤝 Draw!</>
              ) : (
                <>😢 Defeat</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-sm font-medium">You</p>
                <p className="text-3xl font-bold">{userScore}</p>
              </div>
              <div className="text-xl font-bold">vs</div>
              <div className="text-center">
                <p className="text-sm font-medium">Opponent</p>
                <p className="text-3xl font-bold">{opponentScore}</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {userWon ? (
                <p>Congratulations! You won this match.</p>
              ) : isDraw ? (
                <p>The game ended in a draw. Good effort!</p>
              ) : (
                <p>Better luck next time! Practice makes perfect.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={findGame}>
              Play Again
            </Button>
            <Button variant="outline" onClick={leaveGame}>
              Exit
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Active game view
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Game info */}
        <div className="lg:col-span-3 flex justify-between items-center bg-card text-card-foreground rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="font-bold">{formatTimeRemaining(gameState.time_remaining || 0)}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">You</div>
              <div className="font-bold text-lg">
                {isPlayer1 ? gameState.player1_score : gameState.player2_score}
              </div>
            </div>
            <div className="text-xl">vs</div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Opponent</div>
              <div className="font-bold text-lg">
                {isPlayer1 ? gameState.player2_score : gameState.player1_score}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span className="font-bold">
              {isPlayer1 ? (3 - gameState.player1_errors) : (3 - gameState.player2_errors)}/3
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
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

      {/* Periodic table */}
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
