import React, { useState, useEffect } from "react";
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
import { UserPlus, Swords, Clock, Layout } from "lucide-react";
import { MultiplayerGame } from "@/components/multiplayer";
import Timer from "@/components/Timer";
import SinglePlayerGameResult from "@/components/SinglePlayerGameResult";
import { elementData } from "@/data/elements";
import { questions } from "@/data/questions";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserNav } from "@/components/user-nav";

export default function Index() {
  const { session } = useAuth();
  const { toast } = useToast();
  const { checkAndGrantAchievements } = useAchievements();
  const { updateStreak } = useStreaks();
  const { t } = useLanguage();
  const [currentTheme, setCurrentTheme] = useState<TableVariant>('3d_view');
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single');

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeRemaining: 0,
    gameMode: 'standard',
    difficulty: 'easy',
    currentQuestion: null,
    unlockedFeatures: ['standard', 'timed', 'challenge'],
    masteryLevels: {}
  });

  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setGameState(prev => ({ ...prev, gameMode: mode }));
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
      currentQuestion: getNextQuestion(),
      unlockedFeatures: gameState.unlockedFeatures,
      masteryLevels: gameState.masteryLevels
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>
        {session && <UserNav />}
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'single' | 'multi')}>
        <TabsList className="mb-4">
          <TabsTrigger value="single">
            <Swords className="w-4 h-4 mr-2" />
            {t('singlePlayer')}
          </TabsTrigger>
          <TabsTrigger value="multi">
            <UserPlus className="w-4 h-4 mr-2" />
            {t('multiplayer')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          {!selectedMode ? (
            <GameModeSelector 
              onSelectMode={handleModeSelect} 
              unlockedFeatures={['standard', 'timed', 'challenge']} 
            />
          ) : (
            <>
              <PeriodicTable 
                onElementClick={handleElementClick}
                highlightedElements={gameState.currentQuestion ? [gameState.currentQuestion.correctElement] : []}
                variant={currentTheme}
              />
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
            </>
          )}
        </TabsContent>
        
        <TabsContent value="multi">
          <MultiplayerGame onBack={() => setActiveTab('single')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}