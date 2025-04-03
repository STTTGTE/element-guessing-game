
import { User, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Define the minimal game state needed for this component
interface GameStatusProps {
  gameState: {
    player1_id: string;
    player2_id: string | null;
    player1_score: number;
    player2_score: number;
    current_question_index: number;
    status: string;
  };
  userId: string;
}

export function GameStatusBar({ gameState, userId }: GameStatusProps) {
  const isPlayer1 = userId === gameState.player1_id;
  const userScore = isPlayer1 ? gameState.player1_score : gameState.player2_score;
  const opponentScore = isPlayer1 ? gameState.player2_score : gameState.player1_score;
  
  // Calculate progress (1-based for display)
  const currentQuestion = gameState.current_question_index + 1;
  const totalQuestions = 10; // Assuming 10 questions per game
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <>
      <Card>
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">You</span>
          </div>
          <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
            {userScore}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Progress</span>
            </div>
            <span className="text-sm font-medium">
              {currentQuestion}/{totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Opponent</span>
          </div>
          <div className="bg-muted text-muted-foreground px-2 py-0.5 rounded font-bold">
            {opponentScore}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
