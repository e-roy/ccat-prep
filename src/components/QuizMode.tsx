"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";

interface Word {
  word: string;
  meaning: string;
  example: string;
}

interface QuizModeProps {
  words: Word[];
}

export default function QuizMode({ words }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // Shuffle words for quiz
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setQuizWords(shuffled);
  }, [words]);

  const currentWord = quizWords[currentIndex];

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;

    setAnswered(true);
    const isCorrect =
      userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIndex < quizWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowResult(false);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setQuizWords(shuffled);
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  const isCorrect =
    userAnswer.toLowerCase().trim() === currentWord?.word.toLowerCase();

  if (!currentWord) return null;

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col">
      {/* Quiz Header with Stats and Controls */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            Question {currentIndex + 1} of {quizWords.length}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Score: {score}/{currentIndex + (answered ? 1 : 0)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetQuiz} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 py-0 overflow-hidden flex flex-col">
        <CardHeader className="text-center bg-slate-50 border-b border-slate-200 py-4">
          <CardTitle className="text-2xl font-bold text-slate-800 mb-4">
            What word matches this definition?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 flex-1 flex flex-col min-h-0">
              <h3 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Definition
              </h3>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed flex-1 overflow-y-auto">
                {currentWord.meaning}
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-4 rounded-xl border border-emerald-200 flex-1 flex flex-col min-h-0">
              <h3 className="text-base font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Example
              </h3>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed italic flex-1 overflow-y-auto">
                &ldquo;{currentWord.example}&rdquo;
              </p>
            </div>
          </div>

          {/* Quiz Form Section */}
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="answer" className="text-base font-semibold">
                Your Answer
              </Label>
              <Input
                id="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !answered && checkAnswer()
                }
                placeholder="Type the word here..."
                className="text-base mt-2"
                disabled={answered}
              />
            </div>

            {!answered && (
              <Button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="px-6 py-2 text-base"
              >
                Check Answer
              </Button>
            )}

            {showResult && (
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-green-50 border-green-500 text-green-800"
                      : "bg-red-50 border-red-500 text-red-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="text-lg font-bold">
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <p className="text-sm">
                    The correct answer is: <strong>{currentWord.word}</strong>
                  </p>
                </div>

                {currentIndex < quizWords.length - 1 ? (
                  <Button
                    onClick={nextQuestion}
                    className="px-6 py-2 text-base flex items-center gap-2"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="text-center">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-3">
                      <h3 className="text-lg font-bold text-blue-800 mb-1">
                        Quiz Complete!
                      </h3>
                      <p className="text-sm text-blue-700">
                        Final Score: {score}/{quizWords.length} (
                        {Math.round((score / quizWords.length) * 100)}%)
                      </p>
                    </div>
                    <Button onClick={resetQuiz} className="px-6 py-2 text-base">
                      Take Another Quiz
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
