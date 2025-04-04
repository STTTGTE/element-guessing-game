import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiplayerGameResult } from "@/services/multiplayer";

interface GameResultProps {
  gameResult: MultiplayerGameResult;
  user: User | null;
  onPlayAgain: () => Promise<void>;
  onLeaveGame: () => Promise<void>;
}

export function GameResult({ gameResult, user, onPlayAgain, onLeaveGame }: GameResultProps) {
  const isPlayer1 = gameResult.player1_id === user?.id;
  const userScore = isPlayer1 ? gameResult.player1_score : gameResult.player2_score;
  const opponentScore = isPlayer1 ? gameResult.player2_score : gameResult.player1_score;
  const userWon = gameResult.winner_id === user?.id;
  const isDraw = gameResult.is_draw;
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className={`${userWon ? 'bg-green-100 dark:bg-green-900/20' : isDraw ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
          <CardTitle className="text-2xl flex items-center justify-center gap-2 text-foreground">
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
              <p className="text-sm font-medium text-foreground">You</p>
              <p className="text-3xl font-bold text-foreground">{userScore}</p>
            </div>
            <div className="text-xl font-bold text-foreground">vs</div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Opponent</p>
              <p className="text-3xl font-bold text-foreground">{opponentScore}</p>
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
          <Button onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="outline" onClick={onLeaveGame}>
            Exit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
