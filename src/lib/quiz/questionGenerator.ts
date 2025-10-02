import { QuizQuestion, QuizCategory } from "@/types/quiz";
import { MathQuestionGenerator } from "./generators/mathGenerator";
import { VerbalQuestionGenerator } from "./generators/verbalGenerator";
import { LogicalQuestionGenerator } from "./generators/logicalGenerator";
import { SpatialQuestionGenerator } from "./generators/spatialGenerator";

export class QuestionGenerator {
  private static readonly TOTAL_QUESTIONS = 50;

  static generateQuizQuestions(categories: QuizCategory[]): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    // Calculate questions per category
    const enabledCategories = categories.filter(
      (cat) => cat !== QuizCategory.SPATIAL_REASONING
    );
    const questionsPerCategory = Math.floor(
      this.TOTAL_QUESTIONS / enabledCategories.length
    );
    const extraQuestions =
      this.TOTAL_QUESTIONS - questionsPerCategory * enabledCategories.length;

    // Generate questions for each category
    enabledCategories.forEach((category, index) => {
      const count = questionsPerCategory + (index < extraQuestions ? 1 : 0);
      const categoryQuestions = this.generateCategoryQuestions(category, count);
      questions.push(...categoryQuestions);
    });

    // Shuffle questions to mix categories
    return this.shuffleArray(questions);
  }

  private static generateCategoryQuestions(
    category: QuizCategory,
    count: number
  ): QuizQuestion[] {
    switch (category) {
      case QuizCategory.MATH:
        return MathQuestionGenerator.generateQuestions(count);
      case QuizCategory.VERBAL_REASONING:
        return VerbalQuestionGenerator.generateQuestions(count);
      case QuizCategory.LOGICAL_REASONING:
        return LogicalQuestionGenerator.generateQuestions(count);
      case QuizCategory.SPATIAL_REASONING:
        return SpatialQuestionGenerator.generateQuestions(count);
      default:
        return [];
    }
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
