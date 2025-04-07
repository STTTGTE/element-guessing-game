import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import ScoreBoard from "@/components/ScoreBoard";
import { AuthForm } from "@/components/auth/auth-form";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { ElementData, Question } from "@/types/game";
import { elementData } from "@/data/elements";
import { questions } from "@/data/questions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { useAchievements } from "@/hooks/use-achievements";
import { useStreaks } from "@/hooks/use-streaks";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Swords, Clock } from "lucide-react";
import { MultiplayerGame } from "@/components/multiplayer";
import Timer from "@/components/Timer";
import SinglePlayerGameResult from "@/components/SinglePlayerGameResult";

const Index = () => {
  const { session } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');
  const [gameType, setGameType] = useState<'classic' | 'timed'>('classic');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const { toast } = useToast();
  const { checkAndGrantAchievements } = useAchievements();
  const { updateStreak } = useStreaks();

  useEffect(() => {
    if (questions.length > 0 && gameMode === 'single' && !gameStarted) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    }
  }, [gameMode, gameStarted]);

  const handleElementClick = async (element: ElementData) => {
    if (gameMode !== 'single' || gameEnded) return;
    
    setSelectedElement(element);
    
    if (currentQuestion && element.symbol === currentQuestion.correctElement) {
      toast({
        title: "Correct!",
        description: `${element.name} (${element.symbol}) is the right answer!`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
      
      const newScore = score + 1;
      setScore(newScore);
      
      if (session.user && !guestMode) {
        try {
          // Update streak for correct answer
          const currentStreak = await updateStreak();
          checkAndGrantAchievements(newScore, currentStreak || 1);

          // Save game history for classic mode after each answer
          if (gameType === 'classic') {
            await supabase.rpc('insert_game_history', {
              p_user_id: session.user.id,
              p_score: newScore,
              p_total_questions: questionNumber + 1,
              p_game_type: 'single'
            });
          }
        } catch (error) {
          console.error('Error updating game state:', error);
          toast({
            title: "Error",
            description: "Failed to update game state",
            variant: "destructive",
          });
        }
      }
      
      nextQuestion();
    } else if (currentQuestion) {
      toast({
        title: "Incorrect!",
        description: `The correct answer was ${elementData.find(e => e.symbol === currentQuestion.correctElement)?.name} (${currentQuestion.correctElement})`,
        variant: "destructive",
      });
      
      if (session.user && !guestMode && gameType === 'classic') {
        try {
          // Save game history for incorrect answer in classic mode
          await supabase.rpc('insert_game_history', {
            p_user_id: session.user.id,
            p_score: score,
            p_total_questions: questionNumber + 1,
            p_game_type: 'single'
          });
        } catch (error) {
          console.error('Error saving game history:', error);
        }
      }
      
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
          p_game_type: gameType === 'timed' ? 'timed' : 'single'
        });
      } catch (error) {
        console.error('Error saving game history:', error);
      }
    }

    setScore(0);
    setQuestionNumber(0);
    setGameEnded(false);
    setTimeSpent(0);
    setTimerActive(false);
    setGameStarted(false);
    nextQuestion();
  };

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
    setTimeSpent(0);
    setScore(0);
    setQuestionNumber(0);
    nextQuestion();
  };

  const handleTimeUp = async () => {
    setTimerActive(false);
    setGameEnded(true);

    if (session.user && !guestMode) {
      try {
        // Save game history
        await supabase.rpc('insert_game_history', {
          p_user_id: session.user.id,
          p_score: score,
          p_total_questions: questionNumber,
          p_game_type: 'timed'
        });

        // Update streak
        const currentStreak = await updateStreak();
        checkAndGrantAchievements(score, currentStreak || 1);
      } catch (error) {
        console.error('Error saving game history:', error);
        toast({
          title: "Error",
          description: "Failed to save game history",
          variant: "destructive",
        });
      }
    }
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
        setGameEnded(false);
        setTimeSpent(0);
        setTimerActive(false);
        setGameStarted(false);
        nextQuestion();
      }
    }
  };

  const switchGameType = (type: 'classic' | 'timed') => {
    if (gameType !== type) {
      setGameType(type);
      setScore(0);
      setQuestionNumber(0);
      setGameEnded(false);
      setTimeSpent(0);
      setTimerActive(false);
      setGameStarted(false);
      nextQuestion();
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Periodic Table Game
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Tabs value={gameMode} onValueChange={(value) => switchGameMode(value as 'single' | 'multiplayer')}>
                <TabsList>
                  <TabsTrigger value="single">Single Player</TabsTrigger>
                  <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {gameMode === 'single' && (
                <Tabs value={gameType} onValueChange={(value) => switchGameType(value as 'classic' | 'timed')}>
                  <TabsList>
                    <TabsTrigger value="classic">Classic</TabsTrigger>
                    <TabsTrigger value="timed">Timed</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
            <ThemeToggle />
            {session.user && <UserNav />}
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full gap-4 md:gap-6">
        <div className="flex flex-col flex-grow gap-4 md:gap-6">
          {gameMode === 'single' ? (
            <>
              {gameEnded && gameType === 'timed' ? (
                <SinglePlayerGameResult 
                  score={score}
                  totalQuestions={questionNumber}
                  timeSpent={timeSpent}
                  onPlayAgain={resetGame}
                />
              ) : (
                <>
                  <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 md:p-6">
                    {gameType === 'timed' && !gameStarted ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Timed Challenge</h2>
                        <p className="text-muted-foreground mb-6 text-center">
                          Answer as many questions as you can in 60 seconds!
                        </p>
                        <Button size="lg" onClick={startGame} className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Start Challenge
                        </Button>
                      </div>
                    ) : (
                      <>
                        {gameType === 'timed' && (
                          <div className="mb-4">
                            <Timer 
                              initialTime={60} 
                              onTimeUp={handleTimeUp} 
                              isActive={timerActive} 
                            />
                          </div>
                        )}
                        {currentQuestion ? (
                          <QuestionPanel 
                            question={currentQuestion} 
                            questionNumber={questionNumber} 
                          />
                        ) : (
                          <div className="text-center p-4">Loading question...</div>
                        )}
                      </>
                    )}
                  </div>

                  {gameStarted && (
                    <ScoreBoard score={score} questionNumber={questionNumber} resetGame={resetGame} />
                  )}
                  
                  <div className="bg-card text-card-foreground rounded-lg shadow-md p-2 sm:p-4 overflow-x-auto">
                    <PeriodicTable 
                      onElementClick={handleElementClick} 
                      selectedElement={selectedElement}
                      correctElement={currentQuestion?.correctElement}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <MultiplayerGame />
          )}
        </div>

        {!guestMode && (
          <div className="w-full lg:w-80">
            <div className="bg-card text-card-foreground rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold mb-4 text-foreground">Welcome back!</h3>
              <p className="text-muted-foreground">
                Keep playing to improve your knowledge of the periodic table!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
