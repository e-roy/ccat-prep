import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategorySelectionDialog from "@/components/quiz/CategorySelectionDialog";
import QuizInterface from "@/components/quiz/QuizInterface";
import QuizResults from "@/components/quiz/QuizResults";
import {
  QuizQuestion,
  QuizCategory,
  QuizSession,
  QuizMode,
} from "@/types/quiz";
import { ScoringEngine, QuizScore } from "@/lib/quiz/scoring";
import { QuizAI, AIQuestionResponse } from "@/lib/ai/quizAI";
import { useQuizHistoryStore } from "@/lib/history/historyStore";
import { useRouter } from "@/lib/router";
import { Brain, Clock, Target, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function LandingPage() {
  const [quizState, setQuizState] = useState<
    "idle" | "selecting" | "active" | "completed" | "generating" | "error"
  >("idle");
  const [currentQuiz, setCurrentQuiz] = useState<{
    questions: QuizQuestion[];
    categories: QuizCategory[];
    mode: QuizMode;
  } | null>(null);
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(
    null
  );
  const [quizScore, setQuizScore] = useState<QuizScore | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { addSession } = useQuizHistoryStore();
  const { navigate } = useRouter();

  const handleStartQuiz = async (
    categories: QuizCategory[],
    mode: QuizMode
  ) => {
    setQuizState("generating");
    setErrorMessage("");

    try {
      // Add timeout for AI generation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("AI generation timeout")), 75000); // 75 second timeout for verbal questions
      });

      const quizAI = new QuizAI();

      // Try AI generation with timeout
      const aiGenerationPromise = quizAI.generateQuizQuestions(categories);
      const result = (await Promise.race([
        aiGenerationPromise,
        timeoutPromise,
      ])) as AIQuestionResponse;

      // console.log("Quiz generation result:", result);

      if (result.success && result.questions) {
        setCurrentQuiz({
          questions: result.questions,
          categories,
          mode,
        });
        setQuizState("active");
      } else {
        // AI generation failed, try fallback
        console.warn("AI generation failed:", result.error);
        const fallbackQuestions = await quizAI.generateFallbackQuestions(
          categories
        );
        console.log("Fallback questions:", fallbackQuestions);

        setCurrentQuiz({
          questions: fallbackQuestions,
          categories,
          mode,
        });
        setQuizState("active");
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);

      // If AI fails, try fallback immediately
      try {
        console.log("Trying fallback generation...");
        const quizAI = new QuizAI();
        const fallbackQuestions = await quizAI.generateFallbackQuestions(
          categories
        );
        console.log("Fallback questions generated:", fallbackQuestions.length);

        setCurrentQuiz({
          questions: fallbackQuestions,
          categories,
          mode,
        });
        setQuizState("active");
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setErrorMessage(
          "Failed to generate questions. Please try again or check your settings."
        );
        setQuizState("error");
      }
    }
  };

  const handleQuizComplete = (session: QuizSession) => {
    // Calculate score
    const score = ScoringEngine.calculateScore(session);

    // Save to history
    addSession(session);

    // Update state
    setCompletedSession(session);
    setQuizScore(score);
    setQuizState("completed");
  };

  const handleQuizAbandon = () => {
    setQuizState("idle");
    setCurrentQuiz(null);
  };

  const handleRetakeQuiz = () => {
    setQuizState("idle");
    setCurrentQuiz(null);
    setCompletedSession(null);
    setQuizScore(null);
  };

  const handleViewHistory = () => {
    navigate("history");
  };

  const handleRetryGeneration = () => {
    setQuizState("idle");
    setErrorMessage("");
  };

  if (quizState === "active" && currentQuiz) {
    return (
      <QuizInterface
        questions={currentQuiz.questions}
        categories={currentQuiz.categories}
        mode={currentQuiz.mode}
        onComplete={handleQuizComplete}
        onAbandon={handleQuizAbandon}
      />
    );
  }

  if (quizState === "generating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Generating Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <LoadingSpinner size="md" />
            </div>
            <p className="text-slate-600">
              Creating personalized questions for your quiz...
            </p>
            <p className="text-sm text-slate-500">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              {errorMessage || "Failed to generate questions"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetryGeneration}>Try Again</Button>
              <Button variant="outline" onClick={() => navigate("settings")}>
                Check Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "completed" && completedSession && quizScore) {
    return (
      <QuizResults
        session={completedSession}
        score={quizScore}
        onRetakeQuiz={handleRetakeQuiz}
        onViewHistory={handleViewHistory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            CCAT Practice Quiz
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">4 Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 text-center">
                AI-generated questions across Math, Verbal, Logical, and Spatial
                Reasoning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">15 Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 text-center">
                Complete 50 questions within the time limit to simulate real
                test conditions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 text-center">
                Review your performance and track improvement over time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <CategorySelectionDialog
            onStartQuiz={handleStartQuiz}
            trigger={
              <Button size="lg" className="text-lg px-8 py-3">
                Start Practice Quiz
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
