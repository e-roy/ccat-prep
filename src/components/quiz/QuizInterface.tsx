import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  QuizQuestion,
  QuizCategory,
  QuizMode,
  QuizSession,
} from "@/types/quiz";
import { QuizEngine } from "@/lib/quiz/quizEngine";
import QuizTimer from "./QuizTimer";
import QuestionCard from "./QuestionCard";

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  categories: QuizCategory[];
  mode: QuizMode;
  onComplete: (session: QuizSession) => void;
  onAbandon: () => void;
}

export default function QuizInterface({
  questions,
  categories,
  mode,
  onComplete,
  onAbandon,
}: QuizInterfaceProps) {
  const [quizEngine] = useState(
    () => new QuizEngine(questions, categories, mode)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(
    new Set()
  );

  const currentQuestion = questions[currentQuestionIndex];
  const progress = quizEngine.getProgress();

  // Start timing the current question and clear selected answer
  useEffect(() => {
    if (currentQuestion) {
      quizEngine.startQuestion(currentQuestion.id);
    }
    setSelectedAnswer(undefined);
    setShowAnswer(false);
  }, [currentQuestionIndex, currentQuestion, quizEngine]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    // In practice mode, show answer before moving to next question
    if (mode === QuizMode.PRACTICE && selectedAnswer !== undefined) {
      // Submit current answer
      quizEngine.submitAnswer(currentQuestion.id, selectedAnswer);
      setShowAnswer(true);
      return;
    }

    // Submit current answer if selected (for exam mode)
    if (selectedAnswer !== undefined && currentQuestion) {
      quizEngine.submitAnswer(currentQuestion.id, selectedAnswer);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleContinueFromAnswer = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    // Mark question as skipped
    setSkippedQuestions((prev) => new Set(prev).add(currentQuestionIndex));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Reset selected answer for previous question
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevAnswer = quizEngine
        .getCurrentSession()
        .answers.find((a) => a.questionId === prevQuestion.id);
      setSelectedAnswer(prevAnswer?.selectedAnswer);
    }
  };

  const handleComplete = () => {
    // Submit final answer if selected
    if (selectedAnswer !== undefined && currentQuestion) {
      quizEngine.submitAnswer(currentQuestion.id, selectedAnswer);
    }

    setIsCompleted(true);
    const completedSession = quizEngine.completeQuiz();
    onComplete(completedSession);
  };

  const handleAbandon = () => {
    quizEngine.abandonQuiz();
    onAbandon();
  };

  const handleTimeUp = () => {
    handleComplete();
  };

  const handleTimeUpdate = (_seconds: number) => {
    // Time is handled by the quiz engine
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 mb-4">Processing your results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-secondary-foreground">
              CCAT Practice Quiz
            </h1>
            <QuizTimer
              duration={900} // 15 minutes
              onTimeUp={handleTimeUp}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Question {progress.current + 1} of {progress.total}
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showAnswer={showAnswer}
            mode={mode}
            submittedAnswer={
              showAnswer
                ? quizEngine
                    .getCurrentSession()
                    .answers.find((a) => a.questionId === currentQuestion.id)
                : undefined
            }
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="text-blue-600 hover:text-blue-700"
            >
              Skip
            </Button>

            {showAnswer && mode === QuizMode.PRACTICE ? (
              <Button onClick={handleContinueFromAnswer}>
                {currentQuestionIndex === questions.length - 1
                  ? "Complete Quiz"
                  : "Continue"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === undefined}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Complete Quiz"
                  : "Next"}
              </Button>
            )}
          </div>
        </div>

        {/* Answer Display for Practice Mode */}
        {showAnswer &&
          mode === QuizMode.PRACTICE &&
          (() => {
            const submittedAnswer = quizEngine
              .getCurrentSession()
              .answers.find((a) => a.questionId === currentQuestion.id);
            const isCorrect = submittedAnswer?.isCorrect ?? false;

            return (
              <div className="my-6">
                <Card
                  className={`border-2 ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <CardContent className="">
                    <div className="text-center">
                      <div
                        className={`text-lg font-semibold mb-2 ${
                          isCorrect ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </div>
                      <div
                        className={`text-sm ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        The correct answer is:{" "}
                        <strong>
                          {
                            currentQuestion.options[
                              currentQuestion.correctAnswer
                            ]
                          }
                        </strong>
                      </div>
                      {!isCorrect && submittedAnswer && (
                        <div className="text-sm text-red-600 mt-2">
                          Your answer:{" "}
                          {
                            currentQuestion.options[
                              submittedAnswer.selectedAnswer
                            ]
                          }
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
