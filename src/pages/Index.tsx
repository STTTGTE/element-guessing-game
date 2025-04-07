import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import ScoreBoard from "@/components/ScoreBoard";
import GameModeSelector from "@/components/GameModeSelector";
import { ElementData, GameState, GameMode, Question, TableVariant } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { useAchievements } from "@/hooks/use-achievements";
import { useStreaks } from "@/hooks/use-streaks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Swords, Clock } from "lucide-react";
import { MultiplayerGame } from "@/components/multiplayer";
import Timer from "@/components/Timer";
import SinglePlayerGameResult from "@/components/SinglePlayerGameResult";
import { elementData } from "@/data/elements";
import { questions } from "@/data/questions";
import ThemeSelector from "@/components/ThemeSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  const { session } = useAuth();
  const { toast } = useToast();
  const { checkAndGrantAchievements } = useAchievements();
  const { updateStreak } = useStreaks();
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('standard');

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeRemaining: 0,
    gameMode: 'standard',
    difficulty: 'easy',
    currentQuestion: null
  });

  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setGameState(prev => ({ ...prev, gameMode: mode }));
    // Initialize game mode specific settings
  };

  const handleElementClick = (element: ElementData) => {
    if (!gameState.currentQuestion) return;

    const isCorrect = element.symbol === gameState.currentQuestion.correctElement;

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + gameState.currentQuestion!.points,
        streak: prev.streak + 1,
        correctAnswers: prev.correctAnswers + 1,
        questionsAnswered: prev.questionsAnswered + 1,
        currentQuestion: getNextQuestion()
      }));

      toast({
        title: "Correct!",
        description: `+${gameState.currentQuestion.points} points`,
        variant: "success"
      });

      updateStreak();
      checkAndGrantAchievements(gameState.score, gameState.streak);
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        questionsAnswered: prev.questionsAnswered + 1,
        currentQuestion: getNextQuestion()
      }));

      toast({
        title: "Incorrect",
        description: `The correct answer was ${gameState.currentQuestion.correctElement}`,
        variant: "destructive"
      });
    }
  };

  const getNextQuestion = () => {
    if (questions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  useEffect(() => {
    setGameState(prev => ({...prev, currentQuestion: getNextQuestion()}));
  }, []);

  const resetGame = () => {
    setGameState({
      score: 0,
      streak: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      timeRemaining: 0,
      gameMode: gameState.gameMode,
      difficulty: 'easy',
      currentQuestion: getNextQuestion()
    });
  };

  if (!selectedMode) {
    return <GameModeSelector 
      onSelectMode={handleModeSelect} 
      unlockedFeatures={['standard', 'timed', 'challenge']} 
    />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Selection</CardTitle>
              <CardDescription>Choose how you want to view the periodic table</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            </CardContent>
          </Card>
          <PeriodicTable 
            onElementClick={handleElementClick}
            highlightedElements={gameState.currentQuestion ? [gameState.currentQuestion.correctElement] : []}
            variant={currentTheme}
          />
        </div>
        <div className="space-y-4">
          <ScoreBoard 
            score={gameState.score}
            questionNumber={gameState.questionsAnswered}
            resetGame={resetGame}
          />
          <QuestionPanel 
            question={gameState.currentQuestion}
            timeRemaining={gameState.timeRemaining}
            gameMode={gameState.gameMode}
            masteryLevel={0}
          />
        </div>
      </div>
    </div>
  );
}