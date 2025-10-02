import { QuizQuestion, QuizCategory } from "@/types/quiz";
import { shuffleArray } from "./helpers";

export class LogicalQuestionGenerator {
  static generateQuestions(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    // Distribute questions across different CCAT types
    const letterSequences = Math.ceil(count * 0.25); // 25% letter sequences
    const numberSequences = Math.ceil(count * 0.25); // 25% number sequences
    const logicalStatements = Math.ceil(count * 0.25); // 25% logical statements
    const textComparisons =
      count - letterSequences - numberSequences - logicalStatements; // remaining for text comparisons

    // Generate questions for each type
    questions.push(...this.generateLetterSequences(letterSequences));
    questions.push(...this.generateNumberSequences(numberSequences));
    questions.push(...this.generateLogicalStatements(logicalStatements));
    questions.push(...this.generateTextComparisons(textComparisons));

    // Shuffle and return
    return shuffleArray(questions).slice(0, count);
  }

  private static generateLetterSequences(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const sequence = this.createLetterSequence();

      questions.push({
        id: `logical_letter_${Date.now()}_${i}`,
        category: QuizCategory.LOGICAL_REASONING,
        question: sequence.question,
        options: sequence.options,
        correctAnswer: sequence.correctAnswer,
      });
    }

    return questions;
  }

  private static generateNumberSequences(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const sequence = this.createNumberSequence();

      questions.push({
        id: `logical_number_${Date.now()}_${i}`,
        category: QuizCategory.LOGICAL_REASONING,
        question: sequence.question,
        options: sequence.options,
        correctAnswer: sequence.correctAnswer,
      });
    }

    return questions;
  }

  private static generateLogicalStatements(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const statement = this.createLogicalStatement();

      questions.push({
        id: `logical_statement_${Date.now()}_${i}`,
        category: QuizCategory.LOGICAL_REASONING,
        question: statement.question,
        options: statement.options,
        correctAnswer: statement.correctAnswer,
      });
    }

    return questions;
  }

  private static generateTextComparisons(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const comparison = this.createTextComparison();

      questions.push({
        id: `logical_text_${Date.now()}_${i}`,
        category: QuizCategory.LOGICAL_REASONING,
        question: comparison.question,
        options: comparison.options,
        correctAnswer: comparison.correctAnswer,
      });
    }

    return questions;
  }

  // CCAT-style question creation methods

  // TODO: needs improvement
  private static createLetterSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const sequences = [
      {
        question:
          "What would be the next group of letters in the following series?\n\nbadg … dbdf … fcde … hddd",
        correct: "ieee",
        options: ["ieee", "heee", "geee", "feee"] as [
          string,
          string,
          string,
          string
        ],
      },
      {
        question:
          "What would be the next group of letters in the following series?\n\nabcd … cdef … efgh … ghij",
        correct: "ijkl",
        options: ["ijkl", "hijk", "ghij", "fghi"] as [
          string,
          string,
          string,
          string
        ],
      },
      {
        question:
          "What would be the next group of letters in the following series?\n\nwxyz … yzab … abcd … cdef",
        correct: "efgh",
        options: ["efgh", "defg", "cdef", "bcde"] as [
          string,
          string,
          string,
          string
        ],
      },
    ];

    const sequence = sequences[Math.floor(Math.random() * sequences.length)];
    return {
      question: sequence.question,
      options: sequence.options,
      correctAnswer: sequence.options.indexOf(sequence.correct),
    };
  }

  private static createNumberSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const sequenceTypes = [
      () => this.generateArithmeticSequence(),
      () => this.generateGeometricSequence(),
      () => this.generateQuadraticSequence(),
      () => this.generateFibonacciSequence(),
      () => this.generatePowerSequence(),
    ];

    const selectedType =
      sequenceTypes[Math.floor(Math.random() * sequenceTypes.length)];
    return selectedType();
  }

  private static generateArithmeticSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const start = Math.floor(Math.random() * 20) + 1;
    const difference = Math.floor(Math.random() * 10) + 1;
    const length = 5;

    const sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(start + i * difference);
    }

    const correctAnswer = start + length * difference;
    const options = this.generateNumberOptions(correctAnswer);

    return {
      question: `What would be the next number in the following series?\n\n${sequence.join(
        " … "
      )} …`,
      options,
      correctAnswer: options.indexOf(correctAnswer.toString()),
    };
  }

  private static generateGeometricSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const start = Math.floor(Math.random() * 5) + 2;
    const ratio = Math.floor(Math.random() * 3) + 2;
    const length = 5;

    const sequence = [];
    let current = start;
    for (let i = 0; i < length; i++) {
      sequence.push(current);
      current *= ratio;
    }

    const correctAnswer = current;
    const options = this.generateNumberOptions(correctAnswer);

    return {
      question: `What would be the next number in the following series?\n\n${sequence.join(
        " … "
      )} …`,
      options,
      correctAnswer: options.indexOf(correctAnswer.toString()),
    };
  }

  private static generateQuadraticSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const a = Math.floor(Math.random() * 2) + 1;
    const b = Math.floor(Math.random() * 10) - 5;
    const c = Math.floor(Math.random() * 10) + 1;
    const length = 5;

    const sequence = [];
    for (let i = 1; i <= length; i++) {
      sequence.push(a * i * i + b * i + c);
    }

    const correctAnswer =
      a * (length + 1) * (length + 1) + b * (length + 1) + c;
    const options = this.generateNumberOptions(correctAnswer);

    return {
      question: `What would be the next number in the following series?\n\n${sequence.join(
        " … "
      )} …`,
      options,
      correctAnswer: options.indexOf(correctAnswer.toString()),
    };
  }

  private static generateFibonacciSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const start1 = Math.floor(Math.random() * 5) + 1;
    const start2 = Math.floor(Math.random() * 5) + 1;
    const length = 5;

    const sequence = [start1, start2];
    for (let i = 2; i < length; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }

    const correctAnswer = sequence[length - 1] + sequence[length - 2];
    const options = this.generateNumberOptions(correctAnswer);

    return {
      question: `What would be the next number in the following series?\n\n${sequence.join(
        " … "
      )} …`,
      options,
      correctAnswer: options.indexOf(correctAnswer.toString()),
    };
  }

  private static generatePowerSequence(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const base = Math.floor(Math.random() * 3) + 2;
    const length = 5;

    const sequence = [];
    for (let i = 1; i <= length; i++) {
      sequence.push(Math.pow(base, i));
    }

    const correctAnswer = Math.pow(base, length + 1);
    const options = this.generateNumberOptions(correctAnswer);

    return {
      question: `What would be the next number in the following series?\n\n${sequence.join(
        " … "
      )} …`,
      options,
      correctAnswer: options.indexOf(correctAnswer.toString()),
    };
  }

  private static generateNumberOptions(
    correctAnswer: number
  ): [string, string, string, string] {
    const options = [correctAnswer.toString()];
    const range = Math.max(5, Math.floor(correctAnswer * 0.3));

    while (options.length < 4) {
      const variation = Math.floor(Math.random() * range * 2) - range;
      const option = correctAnswer + variation;

      if (option > 0 && !options.includes(option.toString())) {
        options.push(option.toString());
      }
    }

    return shuffleArray(options) as [string, string, string, string];
  }

  // TODO: needs improvement
  private static createLogicalStatement(): {
    question: string;
    options: [string, string, string];
    correctAnswer: number;
  } {
    const statements = [
      {
        question:
          "Assume the first two statements are true. Is the final statement: 1) True, 2) False, or 3) Uncertain based on the information provided?\n\nSusan is taller than Lisa.\nLisa is shorter than Jean.\nJean is taller than Susan.",
        correct: "False",
        options: ["True", "False", "Uncertain"] as [string, string, string],
      },
      {
        question:
          "Assume the first two statements are true. Is the final statement: 1) True, 2) False, or 3) Uncertain based on the information provided?\n\nAll birds can fly.\nPenguins are birds.\nPenguins can fly.",
        correct: "False",
        options: ["True", "False", "Uncertain"] as [string, string, string],
      },
      {
        question:
          "Assume the first two statements are true. Is the final statement: 1) True, 2) False, or 3) Uncertain based on the information provided?\n\nIf it rains, the ground gets wet.\nThe ground is wet.\nIt is raining.",
        correct: "Uncertain",
        options: ["True", "False", "Uncertain"] as [string, string, string],
      },
      {
        question:
          "Assume the first two statements are true. Is the final statement: 1) True, 2) False, or 3) Uncertain based on the information provided?\n\nJohn is older than Mary.\nMary is older than Tom.\nJohn is older than Tom.",
        correct: "True",
        options: ["True", "False", "Uncertain"] as [string, string, string],
      },
    ];

    const statement = statements[Math.floor(Math.random() * statements.length)];
    return {
      question: statement.question,
      options: statement.options,
      correctAnswer: statement.options.indexOf(statement.correct),
    };
  }

  private static createTextComparison(): {
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
  } {
    const comparisons = [
      {
        question:
          "How many of the five items in the left hand column are exactly the same as the corresponding entry in the right hand column?\n\nAcme Cement Co.                                Acme Cement Comp.\nEvans Industrial, Inc.                           Evans Industrials, Inc.\nWilliams & Petersen                             Williams & Peterson\nDeloitte, Stephens and Sons             Deloitte, Stevens and Sons\nCarter Plastics Co                                Carter Plastics Co",
        correct: "1",
        options: ["0", "1", "2", "3"] as [string, string, string, string],
      },
      {
        question:
          "How many of the five items in the left hand column are exactly the same as the corresponding entry in the right hand column?\n\nSmith & Associates                              Smith & Associates\nJohnson Manufacturing Co.                       Johnson Manufacturing Corp.\nBrown Industries, Inc.                         Brown Industries, Inc.\nDavis Construction Ltd.                        Davis Construction Ltd.\nWilson Technology Group                        Wilson Technologies Group",
        correct: "3",
        options: ["1", "2", "3", "4"] as [string, string, string, string],
      },
      {
        question:
          "How many of the five items in the left hand column are exactly the same as the corresponding entry in the right hand column?\n\nABC Corporation                                ABC Corporation\nXYZ Limited                                    XYZ Ltd.\nDEF Industries                                 DEF Industries\nGHI Manufacturing                              GHI Manufacturing\nJKL Services Inc.                              JKL Services Inc.",
        correct: "3",
        options: ["2", "3", "4", "5"] as [string, string, string, string],
      },
    ];

    const comparison =
      comparisons[Math.floor(Math.random() * comparisons.length)];
    return {
      question: comparison.question,
      options: comparison.options,
      correctAnswer: comparison.options.indexOf(comparison.correct),
    };
  }
}
