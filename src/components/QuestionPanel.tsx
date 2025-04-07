
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Question, GameMode } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, SkipForward, Book, Briefcase, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionPanelProps {
  question?: Question;
  timeRemaining: number;
  gameMode: GameMode;
  masteryLevel: number;
  onSkip?: () => void;
  onHint?: () => void;
  onShowHistory?: () => void;
  onShowCareer?: () => void;
}

export default function QuestionPanel({
  question,
  timeRemaining,
  gameMode,
  masteryLevel,
  onSkip,
  onHint,
  onShowHistory,
  onShowCareer
}: QuestionPanelProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const getGameModeLabel = (mode: GameMode) => {
    const labels = {
      'quantum_leap': 'Quantum Leap',
      'synthesis_sprint': 'Synthesis Sprint',
      'isotope_investigator': 'Isotope Investigator',
      'periodic_war': 'Periodic War',
      'nano_architect': 'Nanotechnology Architect',
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
          <Badge variant="outline">Level {masteryLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg"
        >
          {question.text}
        </motion.p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <Progress value={(timeRemaining / (question.timeLimit || 30)) * 100} />
          </div>
          <span>{timeRemaining}s</span>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {question.historicalContext && (
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <p className="text-sm">{question.historicalContext}</p>
                </div>
              )}
              {question.careerPath && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <p className="text-sm">{question.careerPath}</p>
                </div>
              )}
              {question.realWorldApplication && (
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4" />
                  <p className="text-sm">{question.realWorldApplication}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
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
