
import { Question } from "@/types/game";
import { questions } from "@/data/questions";

export class GameQuestionsService {
  private gameQuestions: Question[] = [];

  constructor() {
    this.gameQuestions = this.getRandomQuestions(10);
  }

  /**
   * Gets a specified number of random questions from the question bank
   */
  private getRandomQuestions(count: number): Question[] {
    // Shuffle questions and get the first `count`
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Gets the current question based on the question index
   */
  public getQuestion(questionIndex: number): Question | null {
    if (questionIndex < 0 || questionIndex >= this.gameQuestions.length) {
      return null;
    }
    return this.gameQuestions[questionIndex];
  }

  /**
   * Gets all questions for the game
   */
  public getAllQuestions(): Question[] {
    return this.gameQuestions;
  }
}
