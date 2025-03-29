
import { useState, useEffect } from "react";
import PeriodicTable from "@/components/PeriodicTable";
import QuestionPanel from "@/components/QuestionPanel";
import ScoreBoard from "@/components/ScoreBoard";
import { useToast } from "@/components/ui/use-toast";
import { ElementData, Question } from "@/types/game";
import { elementData } from "@/data/elements";
import { questions } from "@/data/questions";

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const { toast } = useToast();

  // Initialize with a random question
  useEffect(() => {
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    }
  }, []);

  const handleElementClick = (element: ElementData) => {
    setSelectedElement(element);
    
    if (currentQuestion && element.symbol === currentQuestion.correctElement) {
      // Correct answer
      toast({
        title: "Correct!",
        description: `${element.name} (${element.symbol}) is the right answer!`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
      
      setScore(score + 1);
      nextQuestion();
    } else if (currentQuestion) {
      // Wrong answer
      toast({
        title: "Incorrect!",
        description: `The correct answer was ${elementData.find(e => e.symbol === currentQuestion.correctElement)?.name} (${currentQuestion.correctElement})`,
        variant: "destructive",
      });
      
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    // Find a random question that's different from the current one
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

  const resetGame = () => {
    setScore(0);
    setQuestionNumber(0);
    nextQuestion();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Element Guessing Game</h1>
      </header>

      <main className="flex flex-col flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
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
        
        <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
          <PeriodicTable 
            onElementClick={handleElementClick} 
            selectedElement={selectedElement}
            correctElement={currentQuestion?.correctElement}
          />
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        Learn chemistry by guessing elements on the periodic table.
      </footer>
    </div>
  );
};

export default Index;
