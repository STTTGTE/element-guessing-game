
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, RefreshCw, Home } from "lucide-react";

// Define the consistent GameResult type
export interface GameResult {
  winnerId: string | null;
  scores: Record<string, number>;
  isDraw: boolean;
  players: string[];
}

interface GameResultProps {
  gameResult: GameResult;
  user: User | null;
  onPlayAgain: () => Promise<void>;
  onLeaveGame: () => void;
}

export function GameResult({ gameResult, user, onPlayAgain, onLeaveGame }: GameResultProps) {
  const isWinner = gameResult.winnerId === user?.id;
  const isDraw = gameResult.isDraw;
  
  const userScore = user ? gameResult.scores[user.id] || 0 : 0;
  const opponentId = user ? gameResult.players.find(id => id !== user.id) : null;
  const opponentScore = opponentId ? gameResult.scores[opponentId] || 0 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden">
        <CardHeader className={`${
          isDraw 
            ? "bg-yellow-500" 
            : isWinner 
              ? "bg-green-500" 
              : "bg-red-500"
        } text-white p-6`}>
          <CardTitle className="text-center text-2xl">
            {isDraw ? (
              <div className="flex items-center justify-center gap-2">
                <Award className="h-8 w-8" />
                <span>Game Draw!</span>
              </div>
            ) : isWinner ? (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8" />
                <span>Victory!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Award className="h-8 w-8" />
                <span>Defeat</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <div className="text-lg font-medium">You</div>
              <div className="text-3xl font-bold">{userScore}</div>
            </div>
            
            <div className="text-xl font-bold">vs</div>
            
            <div className="text-center flex-1">
              <div className="text-lg font-medium">Opponent</div>
              <div className="text-3xl font-bold">{opponentScore}</div>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground">
            {isDraw ? (
              "It was a close match! Both players performed equally well."
            ) : isWinner ? (
              "Congratulations on your victory! Your knowledge of the periodic table prevailed."
            ) : (
              "Better luck next time! Keep practicing and you'll improve."
            )}
          </p>
        </CardContent>
        
        <CardFooter className="flex gap-4 justify-center p-6 bg-muted/20">
          <Button 
            onClick={onPlayAgain}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Play Again
          </Button>
          <Button 
            variant="outline" 
            onClick={onLeaveGame}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Exit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
