import { QuizSession, QuizCategory } from "@/types/quiz";

export interface QuizScore {
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  categoryScores: Record<
    QuizCategory,
    {
      correct: number;
      total: number;
      percentage: number;
    }
  >;
  timeSpent: number;
  averageTimePerQuestion: number;
  accuracy: number;
}

export class ScoringEngine {
  static calculateScore(session: QuizSession): QuizScore {
    const totalScore = session.score;
    const totalQuestions = session.totalQuestions;
    const percentage =
      totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    // Calculate category scores
    const categoryScores: Record<
      QuizCategory,
      {
        correct: number;
        total: number;
        percentage: number;
      }
    > = {
      [QuizCategory.MATH]: { correct: 0, total: 0, percentage: 0 },
      [QuizCategory.VERBAL_REASONING]: { correct: 0, total: 0, percentage: 0 },
      [QuizCategory.LOGICAL_REASONING]: { correct: 0, total: 0, percentage: 0 },
      [QuizCategory.SPATIAL_REASONING]: { correct: 0, total: 0, percentage: 0 },
    };

    // Count questions and correct answers per category
    session.questions.forEach((question) => {
      categoryScores[question.category].total++;

      const answer = session.answers.find((a) => a.questionId === question.id);
      if (answer && answer.isCorrect) {
        categoryScores[question.category].correct++;
      }
    });

    // Calculate percentages for each category
    Object.keys(categoryScores).forEach((category) => {
      const catScore = categoryScores[category as QuizCategory];
      catScore.percentage =
        catScore.total > 0 ? (catScore.correct / catScore.total) * 100 : 0;
    });

    // Calculate timing metrics
    const timeSpent = session.timeSpent;
    const averageTimePerQuestion =
      totalQuestions > 0 ? timeSpent / totalQuestions : 0;

    // Calculate accuracy (correct answers / total answered)
    const answeredQuestions = session.answers.length;
    const accuracy =
      answeredQuestions > 0 ? (totalScore / answeredQuestions) * 100 : 0;

    return {
      totalScore,
      totalQuestions,
      percentage: Math.round(percentage * 100) / 100,
      categoryScores,
      timeSpent,
      averageTimePerQuestion: Math.round(averageTimePerQuestion * 100) / 100,
      accuracy: Math.round(accuracy * 100) / 100,
    };
  }

  static getPerformanceLevel(percentage: number): {
    level: string;
    color: string;
    description: string;
  } {
    if (percentage >= 90) {
      return {
        level: "Excellent",
        color: "text-green-600",
        description: "Outstanding performance!",
      };
    } else if (percentage >= 80) {
      return {
        level: "Good",
        color: "text-blue-600",
        description: "Well done!",
      };
    } else if (percentage >= 70) {
      return {
        level: "Average",
        color: "text-yellow-600",
        description: "Decent performance",
      };
    } else if (percentage >= 60) {
      return {
        level: "Below Average",
        color: "text-orange-600",
        description: "Room for improvement",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        description: "Needs significant improvement",
      };
    }
  }

  static getCategoryPerformance(categoryScore: {
    correct: number;
    total: number;
    percentage: number;
  }): {
    level: string;
    color: string;
  } {
    const { percentage } = categoryScore;

    if (percentage >= 85) {
      return { level: "Strong", color: "text-green-600" };
    } else if (percentage >= 70) {
      return { level: "Good", color: "text-blue-600" };
    } else if (percentage >= 55) {
      return { level: "Average", color: "text-yellow-600" };
    } else {
      return { level: "Weak", color: "text-red-600" };
    }
  }

  static generateStudyRecommendations(score: QuizScore): string[] {
    const recommendations: string[] = [];

    // Overall performance recommendations
    if (score.percentage < 70) {
      recommendations.push(
        "Consider taking more practice quizzes to improve overall performance"
      );
    }

    if (score.averageTimePerQuestion > 20) {
      recommendations.push(
        "Work on improving speed - aim for under 18 seconds per question"
      );
    }

    // Category-specific recommendations
    Object.entries(score.categoryScores).forEach(([category, catScore]) => {
      if (catScore.percentage < 60) {
        switch (category) {
          case QuizCategory.MATH:
            recommendations.push(
              "Focus on basic arithmetic and word problems for Math"
            );
            break;
          case QuizCategory.VERBAL_REASONING:
            recommendations.push(
              "Study vocabulary words and practice reading comprehension"
            );
            break;
          case QuizCategory.LOGICAL_REASONING:
            recommendations.push(
              "Practice pattern recognition and logical puzzles"
            );
            break;
          case QuizCategory.SPATIAL_REASONING:
            recommendations.push("Work on visual-spatial reasoning exercises");
            break;
        }
      }
    });

    // Positive reinforcement
    const strongCategories = Object.entries(score.categoryScores)
      .filter(([, catScore]) => catScore.percentage >= 80)
      .map(([category]) => category);

    if (strongCategories.length > 0) {
      recommendations.push(
        `Great job in ${strongCategories.join(", ")}! Keep up the good work.`
      );
    }

    return recommendations;
  }

  static compareWithPrevious(
    currentScore: QuizScore,
    previousScore?: QuizScore
  ): {
    improvement: number;
    trend: "improving" | "declining" | "stable";
    message: string;
  } {
    if (!previousScore) {
      return {
        improvement: 0,
        trend: "stable",
        message: "This is your first quiz - great start!",
      };
    }

    const improvement = currentScore.percentage - previousScore.percentage;

    let trend: "improving" | "declining" | "stable";
    let message: string;

    if (improvement > 5) {
      trend = "improving";
      message = `Great improvement! You're ${improvement.toFixed(
        1
      )}% better than last time.`;
    } else if (improvement < -5) {
      trend = "declining";
      message = `Performance dropped by ${Math.abs(improvement).toFixed(
        1
      )}%. Keep practicing!`;
    } else {
      trend = "stable";
      message = "Performance is consistent with your previous attempt.";
    }

    return { improvement, trend, message };
  }
}
