
import React, { useState } from "react";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import ScoreBoard from "@/components/ScoreBoard";
import { ElementData, Question } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useAchievements } from "@/hooks/use-achievements";
import { useStreaks } from "@/hooks/use-streaks";
import { questions } from "@/data/questions";
import { elementData } from "@/data/elements";

interface SinglePlayerGameProps {
  guestMode: boolean;
}

export function SinglePlayerGame({ guestMode }: SinglePlayerGameProps) {
  const { session } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  });
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const { toast } = useToast();
  const { checkAndGrantAchievements } = useAchievements();
  const { updateStreak } = useStreaks();

  const handleElementClick = async (element: ElementData) => {
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
        try {
          const currentStreak = await updateStreak();
          
          // Only check for achievements if updateStreak returns a number
          if (typeof currentStreak === 'number') {
            checkAndGrantAchievements(score + 1, currentStreak);
          }
        } catch (error) {
          console.error("Error updating streak:", error);
        }
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

  return (
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
  );
}
