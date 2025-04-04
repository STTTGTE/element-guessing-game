import { Clock, Shield } from "lucide-react";
import { MultiplayerGameState } from "@/services/multiplayer";

interface GameStatusBarProps {
  gameState: MultiplayerGameState;
  userId: string;
}

export function GameStatusBar({ gameState, userId }: GameStatusBarProps) {
  const isPlayer1 = gameState.player1_id === userId;
  
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="lg:col-span-3 flex justify-between items-center bg-card text-card-foreground rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <span className="font-bold text-foreground">{formatTimeRemaining(gameState.time_remaining || 0)}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">You</div>
          <div className="font-bold text-lg text-foreground">
            {isPlayer1 ? gameState.player1_score : gameState.player2_score}
          </div>
        </div>
        <div className="text-xl text-foreground">vs</div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Opponent</div>
          <div className="font-bold text-lg text-foreground">
            {isPlayer1 ? gameState.player2_score : gameState.player1_score}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-red-500" />
        <span className="font-bold text-foreground">
          {isPlayer1 ? (3 - gameState.player1_errors) : (3 - gameState.player2_errors)}/3
        </span>
      </div>
    </div>
  );
}
