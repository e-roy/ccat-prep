import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QuizQuestion, QuizCategory, QuizMode, QuizAnswer } from "@/types/quiz";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  showAnswer?: boolean;
  mode?: QuizMode;
  submittedAnswer?: QuizAnswer;
}

const categoryLabels: Record<QuizCategory, string> = {
  [QuizCategory.MATH]: "Math",
  [QuizCategory.VERBAL_REASONING]: "Verbal",
  [QuizCategory.LOGICAL_REASONING]: "Logical",
  [QuizCategory.SPATIAL_REASONING]: "Spatial",
};

const categoryColors: Record<QuizCategory, string> = {
  [QuizCategory.MATH]: "bg-blue-100 text-blue-800",
  [QuizCategory.VERBAL_REASONING]: "bg-green-100 text-green-800",
  [QuizCategory.LOGICAL_REASONING]: "bg-purple-100 text-purple-800",
  [QuizCategory.SPATIAL_REASONING]: "bg-orange-100 text-orange-800",
};

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  showAnswer = false,
  mode = QuizMode.EXAM,
  submittedAnswer,
}: QuestionCardProps) {
  return (
    <Card className="w-full overflow-hidden py-4 px-2 md:px-4">
      <CardHeader className="pb-2 px-2 md:px-4">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-semibold text-secondary-foreground leading-tight whitespace-pre-line">
            {question.question}
          </CardTitle>
          <Badge
            className={`${
              categoryColors[question.category]
            } px-3 py-1 rounded-full text-sm font-medium hidden md:block`}
          >
            {categoryLabels[question.category]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-2 md:px-4">
        <RadioGroup
          value={selectedAnswer !== undefined ? selectedAnswer.toString() : ""}
          onValueChange={(value) => {
            if (value !== "") {
              onAnswerSelect(parseInt(value));
            }
          }}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = selectedAnswer === index;

            // Base mobile-friendly styling
            let optionClass =
              "flex items-center w-full p-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/50";

            // Selected state styling with nice border
            if (isSelected && !showAnswer) {
              optionClass =
                "flex items-center w-full p-4 rounded-xl transition-all duration-200 ease-in-out cursor-pointer border-2 border-blue-500 bg-blue-50 shadow-sm";
            }

            // Answer feedback styling for practice mode
            if (showAnswer && mode === QuizMode.PRACTICE && submittedAnswer) {
              if (isCorrect) {
                optionClass =
                  "flex items-center w-full p-4 rounded-xl border-2 border-green-400 bg-green-50 shadow-sm";
              } else if (isSelected && !submittedAnswer.isCorrect) {
                optionClass =
                  "flex items-center w-full p-4 rounded-xl border-2 border-red-400 bg-red-50 shadow-sm";
              } else {
                optionClass =
                  "flex items-center w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50";
              }
            }

            return (
              <div key={index} className="relative">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={showAnswer && mode === QuizMode.PRACTICE}
                  className="sr-only"
                />
                <Label htmlFor={`option-${index}`} className={optionClass}>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 mr-1 md:mr-4 flex-shrink-0 transition-all duration-200">
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-3 text-lg">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-800 text-base leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </div>
                  {showAnswer &&
                    mode === QuizMode.PRACTICE &&
                    submittedAnswer && (
                      <div className="ml-3 flex-shrink-0">
                        {isCorrect && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              ✓
                            </span>
                          </div>
                        )}
                        {isSelected && !submittedAnswer.isCorrect && (
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              ✗
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
