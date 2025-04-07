
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Question, GameMode } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, SkipForward } from 'lucide-react';

interface QuestionPanelProps {
  question?: Question;
  timeRemaining: number;
  gameMode: GameMode;
  onSkip?: () => void;
  onHint?: () => void;
}

export default function QuestionPanel({
  question,
  timeRemaining,
  gameMode,
  onSkip,
  onHint
}: QuestionPanelProps) {
  const getGameModeLabel = (mode: GameMode) => {
    const labels = {
      'quantum_leap': 'Quantum Leap',
      'synthesis_sprint': 'Synthesis Sprint',
      'isotope_investigator': 'Isotope Investigator',
      'periodic_war': 'Periodic War',
      'standard': 'Standard Quiz'
    };
    return labels[mode];
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'hard': 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  if (!question) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Loading next question...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          {getGameModeLabel(gameMode)}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{question.category}</Badge>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{question.text}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <Progress value={(timeRemaining / (question.timeLimit || 30)) * 100} />
          </div>
          <span>{timeRemaining}s</span>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onHint}
            disabled={!question.hint}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            Hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSkip}
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
