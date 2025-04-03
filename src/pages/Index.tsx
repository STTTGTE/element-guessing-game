import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import ScoreBoard from "@/components/ScoreBoard";
import { AuthForm } from "@/components/auth/auth-form";
import { GameHistory } from "@/components/game-history";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { ElementData, Question } from "@/types/game";
import { elementData } from "@/data/elements";
import { questions } from "@/data/questions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Achievements } from "@/components/achievements";
import { StreakDisplay } from "@/components/streak-display";
import { useAchievements } from "@/hooks/use-achievements";
import { useStreaks } from "@/hooks/use-streaks";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Swords } from "lucide-react";
import { MultiplayerGame } from "@/components/multiplayer";

const Index = () => {
  const { session } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const { toast } = useToast();
  const { checkAndGrantAchievements } = useAchievements();
  const { updateStreak } = useStreaks();

  useEffect(() => {
    if (questions.length > 0 && gameMode === 'single') {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    }
  }, [gameMode]);

  const handleElementClick = async (element: ElementData) => {
    if (gameMode !== 'single') return;
    
    setSelectedElement(element);
    
    if (currentQuestion && element.symbol === currentQuestion.correctElement) {
      toast({
        title: "Correct!",
        description: `${element.name} (${element.symbol}) is the right answer!`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
      
      setScore(score + 1);
      nextQuestion();
      
      if (session.user && !guestMode) {
        const currentStreak = await updateStreak();
        checkAndGrantAchievements(score + 1, currentStreak || 1);
      }
    } else if (currentQuestion) {
      toast({
        title: "Incorrect!",
        description: `The correct answer was ${elementData.find(e => e.symbol === currentQuestion.correctElement)?.name} (${currentQuestion.correctElement})`,
        variant: "destructive",
      });
      
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    let randomIndex;
    let newQuestion;
    
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
      newQuestion = questions[randomIndex];
    } while (newQuestion.id === currentQuestion?.id && questions.length > 1);
    
    setCurrentQuestion(newQuestion);
    setQuestionNumber(questionNumber + 1);
    setSelectedElement(null);
  };

  const resetGame = async () => {
    if (session.user && !guestMode) {
      try {
        await supabase.rpc('insert_game_history', {
          p_user_id: session.user.id,
          p_score: score,
          p_total_questions: questionNumber,
          p_game_mode: 'single'
        });
      } catch (error) {
        console.error('Error saving game history:', error);
      }
    }

    setScore(0);
    setQuestionNumber(0);
    nextQuestion();
  };

  const startGuestMode = () => {
    setGuestMode(true);
  };

  const exitGuestMode = () => {
    setGuestMode(false);
  };

  const switchGameMode = (mode: 'single' | 'multiplayer') => {
    if (gameMode !== mode) {
      setGameMode(mode as 'single' | 'multiplayer');
      if (mode === 'single') {
        setScore(0);
        setQuestionNumber(0);
        nextQuestion();
      }
    }
  };

  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session.user && !guestMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <AuthForm />
        <div className="text-center">
          <p className="text-gray-500 mb-2">or</p>
          <Button onClick={startGuestMode} variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Play as Guest
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md relative">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Element Guessing Game</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {guestMode ? (
              <Button onClick={exitGuestMode} size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            ) : (
              <UserNav />
            )}
          </div>
        </div>
      </header>

      <div className="bg-muted/40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={gameMode} onValueChange={(value) => switchGameMode(value as 'single' | 'multiplayer')} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mt-2">
              <TabsTrigger value="single">Single Player</TabsTrigger>
              <TabsTrigger value="multiplayer" className="flex items-center gap-1">
                <Swords className="h-4 w-4" /> Multiplayer
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="flex flex-col lg:flex-row flex-grow p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full gap-4 md:gap-6">
        <div className="flex flex-col flex-grow gap-4 md:gap-6">
          {gameMode === 'single' ? (
            <>
              <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 md:p-6">
                {currentQuestion ? (
                  <QuestionPanel 
                    question={currentQuestion} 
                    questionNumber={questionNumber} 
                  />
                ) : (
                  <div className="text-center p-4">Loading question...</div>
                )}
              </div>

              <ScoreBoard score={score} questionNumber={questionNumber} resetGame={resetGame} />
              
              <div className="bg-card text-card-foreground rounded-lg shadow-md p-2 sm:p-4 overflow-x-auto">
                <PeriodicTable 
                  onElementClick={handleElementClick} 
                  selectedElement={selectedElement}
                  correctElement={currentQuestion?.correctElement}
                />
              </div>
            </>
          ) : (
            <MultiplayerGame />
          )}
        </div>

        {!guestMode ? (
          <div className="w-full lg:w-80">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="streak">Streak</TabsTrigger>
                <TabsTrigger value="achievements">Trophies</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-2">
                <GameHistory />
              </TabsContent>
              <TabsContent value="streak" className="mt-2">
                <StreakDisplay />
              </TabsContent>
              <TabsContent value="achievements" className="mt-2">
                <Achievements />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="w-full lg:w-80">
            <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold mb-4">Guest Mode</h3>
              <p className="text-muted-foreground mb-4">
                You're playing as a guest. Sign in to track your progress, earn achievements, and keep your streak going!
              </p>
              <Button onClick={exitGuestMode} className="w-full">
                Sign In Now
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
