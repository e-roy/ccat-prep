import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCategory, CategoryInfo, QuizMode } from "@/types/quiz";
import {
  Calculator,
  Brain,
  BookOpen,
  Shapes,
  CheckSquare,
  GraduationCap,
  Book,
} from "lucide-react";

interface CategorySelectionDialogProps {
  onStartQuiz: (categories: QuizCategory[], mode: QuizMode) => void;
  trigger: React.ReactNode;
}

const categoryInfo: CategoryInfo[] = [
  {
    id: QuizCategory.MATH,
    name: "Math",
    description: "Mathematical reasoning and problem-solving",
    icon: "Calculator",
    enabled: true,
  },
  {
    id: QuizCategory.VERBAL_REASONING,
    name: "Verbal Reasoning",
    description: "Vocabulary and language comprehension",
    icon: "BookOpen",
    enabled: true,
  },
  {
    id: QuizCategory.LOGICAL_REASONING,
    name: "Logical Reasoning",
    description: "Pattern recognition and logical thinking",
    icon: "Brain",
    enabled: true,
  },
  {
    id: QuizCategory.SPATIAL_REASONING,
    name: "Spatial Reasoning",
    description: "Visual and spatial problem-solving",
    icon: "Shapes",
    enabled: false, // Placeholder for now
  },
];

const iconMap = {
  Calculator,
  BookOpen,
  Brain,
  Shapes,
};

export default function CategorySelectionDialog({
  onStartQuiz,
  trigger,
}: CategorySelectionDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<QuizCategory[]>([
    QuizCategory.MATH,
    QuizCategory.VERBAL_REASONING,
    QuizCategory.LOGICAL_REASONING,
  ]);
  const [selectedMode, setSelectedMode] = useState<QuizMode>(QuizMode.PRACTICE);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: QuizCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSelectAll = () => {
    const enabledCategories = categoryInfo
      .filter((c) => c.enabled)
      .map((c) => c.id);

    // Check if all enabled categories are already selected
    const allSelected = enabledCategories.every((category) =>
      selectedCategories.includes(category)
    );

    if (allSelected) {
      // If all are selected, deselect all
      setSelectedCategories([]);
    } else {
      // If not all are selected, select all
      setSelectedCategories(enabledCategories);
    }
  };

  const handleStartQuiz = () => {
    if (selectedCategories.length > 0) {
      onStartQuiz(selectedCategories, selectedMode);
      setIsOpen(false);
    }
  };

  const canStartQuiz = selectedCategories.length > 0;

  // Check if all enabled categories are selected
  const enabledCategories = categoryInfo
    .filter((c) => c.enabled)
    .map((c) => c.id);
  const allCategoriesSelected = enabledCategories.every((category) =>
    selectedCategories.includes(category)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Quiz Categories</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-slate-600 hidden md:block">
            Choose which categories to include in your 15-minute quiz. Each
            category will have 12-13 questions.
          </div>

          {/* Quiz Mode Selection */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-colors py-2 ${
                  selectedMode === QuizMode.PRACTICE
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-slate-50"
                }`}
                onClick={() => setSelectedMode(QuizMode.PRACTICE)}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center space-x-3">
                    <Book className="w-5 h-5 text-blue-600 hidden md:block" />
                    <div>
                      <CardTitle className="text-sm">Practice</CardTitle>
                      <p className="text-xs text-slate-600">
                        See answers after each question
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card
                className={`cursor-pointer transition-colors py-2 ${
                  selectedMode === QuizMode.EXAM
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-slate-50"
                }`}
                onClick={() => setSelectedMode(QuizMode.EXAM)}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-green-600 hidden md:block" />
                    <div>
                      <CardTitle className="text-sm">Exam</CardTitle>
                      <p className="text-xs text-slate-600">
                        No answers until the end
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <Card
              key="select-all"
              className={`cursor-pointer transition-colors py-2 ${
                allCategoriesSelected
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-slate-50"
              }`}
              onClick={handleSelectAll}
            >
              <CardHeader className="">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={allCategoriesSelected}
                    onChange={handleSelectAll}
                  />
                  <CheckSquare className="w-5 h-5 text-slate-600" />
                  <div>
                    <CardTitle className="text-base">Select All</CardTitle>
                    <p className="text-sm text-slate-600">
                      {allCategoriesSelected
                        ? "Deselect all categories"
                        : "Select all categories"}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {categoryInfo.map((category) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap];
              const isSelected = selectedCategories.includes(category.id);

              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-colors py-2 gap-2 ${
                    isSelected
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-slate-50"
                  } ${
                    !category.enabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    category.enabled && handleCategoryToggle(category.id)
                  }
                >
                  <CardHeader className="">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected}
                        disabled={!category.enabled}
                        onChange={() =>
                          category.enabled && handleCategoryToggle(category.id)
                        }
                      />
                      <Icon className="w-5 h-5 text-slate-600" />
                      <div>
                        <CardTitle className="text-base">
                          {category.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {!category.enabled && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-amber-600">Coming soon</p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartQuiz} disabled={!canStartQuiz}>
              Start Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
