import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RefreshCw } from "lucide-react";

interface SinglePlayerGameResultProps {
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  onPlayAgain: () => void;
}

const SinglePlayerGameResult = ({ 
  score, 
  totalQuestions, 
  timeSpent, 
  onPlayAgain 
}: SinglePlayerGameResultProps) => {
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="bg-green-100 dark:bg-green-900/20">
          <CardTitle className="text-2xl flex items-center justify-center gap-2 text-foreground">
            <Trophy className="h-6 w-6 text-amber-500" />
            Game Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-card rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-foreground">{score}</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-bold text-foreground">{accuracy}%</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-3xl font-bold text-foreground">{formattedTime}</p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>You answered {score} out of {totalQuestions} questions correctly.</p>
            <p>Keep practicing to improve your knowledge of the periodic table!</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={onPlayAgain} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SinglePlayerGameResult; 