import { Question } from "@/types/game";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
}

const QuestionPanel = ({ question, questionNumber }: QuestionPanelProps) => {
  const [showHint, setShowHint] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-sm text-muted-foreground mb-2">Question {questionNumber + 1}</div>
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">{question.text}</h2>
      
      {question.hint && (
        <div className="w-full flex flex-col items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-muted-foreground mb-2"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4" />
            {showHint ? "Hide hint" : "Show hint"}
          </Button>
          
          {showHint && (
            <div className="text-sm italic text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-md">
              {question.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
