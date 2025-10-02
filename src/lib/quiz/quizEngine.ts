import {
  QuizQuestion,
  QuizAnswer,
  QuizSession,
  QuizCategory,
  QuizMode,
} from "@/types/quiz";

export class QuizEngine {
  private session: QuizSession;
  private startTime: Date;
  private questionStartTimes: Map<string, Date> = new Map();

  constructor(
    questions: QuizQuestion[],
    categories: QuizCategory[],
    mode: QuizMode
  ) {
    this.startTime = new Date();
    this.session = {
      id: this.generateSessionId(),
      startTime: this.startTime,
      questions,
      answers: [],
      score: 0,
      totalQuestions: questions.length,
      timeSpent: 0,
      status: "in_progress",
      categoryScores: this.initializeCategoryScores(categories),
      mode,
    };
  }

  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeCategoryScores(
    categories: QuizCategory[]
  ): Record<QuizCategory, number> {
    const scores: Record<QuizCategory, number> = {
      [QuizCategory.MATH]: 0,
      [QuizCategory.VERBAL_REASONING]: 0,
      [QuizCategory.LOGICAL_REASONING]: 0,
      [QuizCategory.SPATIAL_REASONING]: 0,
    };
    return scores;
  }

  startQuestion(questionId: string): void {
    this.questionStartTimes.set(questionId, new Date());
  }

  submitAnswer(questionId: string, selectedAnswer: number): QuizAnswer {
    const question = this.session.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error(`Question with id ${questionId} not found`);
    }

    const questionStartTime = this.questionStartTimes.get(questionId);
    const timeSpent = questionStartTime
      ? Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)
      : 0;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const answer: QuizAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
    };

    // Update session
    this.session.answers.push(answer);

    // Update category score
    if (isCorrect) {
      this.session.categoryScores[question.category]++;
    }

    return answer;
  }

  completeQuiz(): QuizSession {
    const endTime = new Date();
    this.session.endTime = endTime;
    this.session.timeSpent = Math.floor(
      (endTime.getTime() - this.startTime.getTime()) / 1000
    );
    this.session.score = this.session.answers.filter((a) => a.isCorrect).length;
    this.session.status = "completed";

    return this.session;
  }

  abandonQuiz(): QuizSession {
    const endTime = new Date();
    this.session.endTime = endTime;
    this.session.timeSpent = Math.floor(
      (endTime.getTime() - this.startTime.getTime()) / 1000
    );
    this.session.score = this.session.answers.filter((a) => a.isCorrect).length;
    this.session.status = "abandoned";

    return this.session;
  }

  getCurrentSession(): QuizSession {
    return { ...this.session };
  }

  getQuestionById(questionId: string): QuizQuestion | undefined {
    return this.session.questions.find((q) => q.id === questionId);
  }

  getAnsweredQuestions(): string[] {
    return this.session.answers.map((a) => a.questionId);
  }

  getUnansweredQuestions(): QuizQuestion[] {
    const answeredIds = this.getAnsweredQuestions();
    return this.session.questions.filter((q) => !answeredIds.includes(q.id));
  }

  getProgress(): { current: number; total: number; percentage: number } {
    const current = this.session.answers.length;
    const total = this.session.questions.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return { current, total, percentage };
  }

  getCategoryProgress(): Record<
    QuizCategory,
    { answered: number; total: number; correct: number }
  > {
    const categoryProgress: Record<
      QuizCategory,
      { answered: number; total: number; correct: number }
    > = {
      [QuizCategory.MATH]: { answered: 0, total: 0, correct: 0 },
      [QuizCategory.VERBAL_REASONING]: { answered: 0, total: 0, correct: 0 },
      [QuizCategory.LOGICAL_REASONING]: { answered: 0, total: 0, correct: 0 },
      [QuizCategory.SPATIAL_REASONING]: { answered: 0, total: 0, correct: 0 },
    };

    // Count total questions per category
    this.session.questions.forEach((question) => {
      categoryProgress[question.category].total++;
    });

    // Count answered and correct answers per category
    this.session.answers.forEach((answer) => {
      const question = this.getQuestionById(answer.questionId);
      if (question) {
        categoryProgress[question.category].answered++;
        if (answer.isCorrect) {
          categoryProgress[question.category].correct++;
        }
      }
    });

    return categoryProgress;
  }

  getTimeRemaining(timeLimit: number): number {
    const elapsed = Math.floor(
      (new Date().getTime() - this.startTime.getTime()) / 1000
    );
    return Math.max(0, timeLimit - elapsed);
  }

  isTimeUp(timeLimit: number): boolean {
    return this.getTimeRemaining(timeLimit) <= 0;
  }
}
