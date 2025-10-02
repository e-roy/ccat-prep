import { QuizQuestion, QuizCategory } from "@/types/quiz";
import {
  shuffleArray,
  generateNumericOptions,
  generateMonetaryOptions,
  generateDollarOptions,
  generateDecimalComparisonOptions,
} from "./helpers";

export class MathQuestionGenerator {
  static generateQuestions(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    // Distribute questions across different types
    const wordProblems = Math.floor(count * 0.7); // 70% word problems
    const percentages = Math.floor(count * 0.2); // 20% percentages
    const algebra = count - wordProblems - percentages; // remaining for algebra

    // Generate questions for each type
    questions.push(...this.generateWordProblems(wordProblems));
    questions.push(...this.generatePercentageQuestions(percentages));
    questions.push(...this.generateAlgebraQuestions(algebra));

    // Shuffle and return
    return shuffleArray(questions).slice(0, count);
  }

  private static generateWordProblems(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    const wordProblemTypes = [
      () => this.createMagazineCostQuestion(),
      () => this.createDiscountQuestion(),
      () => this.createAverageQuestion(),
      () => this.createRestaurantSalesQuestion(),
      () => this.createCornProductionQuestion(),
      () => this.createSpeedDistanceQuestion(),
      () => this.createDecimalComparisonQuestion(),
      () => this.createGeometryQuestion(), // ?????
      () => this.createRatioQuestion(), //  ?????
    ];

    for (let i = 0; i < count; i++) {
      const typeIndex = i % wordProblemTypes.length;
      const { question, correctAnswer, options } =
        wordProblemTypes[typeIndex]();

      questions.push({
        id: `math_word_${Date.now()}_${i}`,
        category: QuizCategory.MATH,
        question,
        options,
        correctAnswer,
      });
    }

    return questions;
  }

  private static generatePercentageQuestions(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const percentageType = Math.random();
      let question: string;
      let correctAnswer: number;
      let options: [string, string, string, string];

      if (percentageType < 0.4) {
        // "X is Y% of what number?" type
        const percentage = (Math.floor(Math.random() * 5) + 1) * 5; // 5-25% (divisible by 5)
        const result = Math.floor(Math.random() * 200) + 50; // 50-250
        const originalNumber = Math.round((result / percentage) * 100);

        question = `${result} is ${percentage}% of what number?`;
        const { options: options1, correctIndex: correctIndex1 } =
          generateNumericOptions(originalNumber);
        correctAnswer = correctIndex1;
        options = options1;
      } else if (percentageType < 0.7) {
        // "What is X% of Y?" type
        const percentage = (Math.floor(Math.random() * 7) + 2) * 5; // 10-40% (divisible by 5)
        const number = Math.floor(Math.random() * 200) + 50; // 50-250
        const result = Math.round((number * percentage) / 100);

        question = `What is ${percentage}% of ${number}?`;
        const { options: options2, correctIndex: correctIndex2 } =
          generateNumericOptions(result);
        correctAnswer = correctIndex2;
        options = options2;
      } else {
        // "X increased/decreased by Y%" type
        const isIncrease = Math.random() < 0.5;
        const percentage = (Math.floor(Math.random() * 6) + 2) * 5; // 10-35% (divisible by 5)
        const originalNumber = Math.floor(Math.random() * 1000) + 100; // 100-1100
        const change = Math.round((originalNumber * percentage) / 100);
        const result = isIncrease
          ? originalNumber + change
          : originalNumber - change;

        question = `A number starts at ${originalNumber}. It ${
          isIncrease ? "increases" : "decreases"
        } by ${percentage}%. What is the new value?`;
        const { options: options3, correctIndex: correctIndex3 } =
          generateNumericOptions(result);
        correctAnswer = correctIndex3;
        options = options3;
      }

      questions.push({
        id: `math_percentage_${Date.now()}_${i}`,
        category: QuizCategory.MATH,
        question,
        options,
        correctAnswer,
      });
    }

    return questions;
  }

  private static generateAlgebraQuestions(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const algebraType = Math.random();
      let question: string;
      let correctAnswer: number;
      let options: [string, string, string, string];

      if (algebraType < 0.5) {
        // Simple linear equations: ax + b = c
        const x = Math.floor(Math.random() * 20) + 1; // 1-20
        const a = Math.floor(Math.random() * 5) + 2; // 2-6
        const b = Math.floor(Math.random() * 20) + 1; // 1-20
        const c = a * x + b;

        question = `If ${a}x + ${b} = ${c}, what is x?`;
        const { options: options4, correctIndex: correctIndex4 } =
          generateNumericOptions(x);
        correctAnswer = correctIndex4;
        options = options4;
      } else {
        // Two-variable systems (simplified)
        const x = Math.floor(Math.random() * 10) + 1; // 1-10
        const y = Math.floor(Math.random() * 10) + 1; // 1-10
        const a = Math.floor(Math.random() * 3) + 2; // 2-4
        const b = Math.floor(Math.random() * 3) + 2; // 2-4
        const c = a * x + b * y;

        question = `If ${a}x + ${b}y = ${c}, and x = ${x}, what is y?`;
        const { options: options5, correctIndex: correctIndex5 } =
          generateNumericOptions(y);
        correctAnswer = correctIndex5;
        options = options5;
      }

      questions.push({
        id: `math_algebra_${Date.now()}_${i}`,
        category: QuizCategory.MATH,
        question,
        options,
        correctAnswer,
      });
    }

    return questions;
  }

  /////////////////////////////////////////////////////////
  //
  // Specific question generators based on CCAT examples
  //
  /////////////////////////////////////////////////////////

  // Based on question: A magazine sells for 75 cents. How much will it cost to buy five magazines?
  private static createMagazineCostQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const pricePerMagazine = Math.floor(Math.random() * 50) + 25; // 25-75 cents
    const quantity = Math.floor(Math.random() * 8) + 3; // 3-10 magazines
    const totalCost = pricePerMagazine * quantity;

    const question = `A magazine sells for ${pricePerMagazine} cents. How much will it cost to buy ${quantity} magazines?`;
    const { options, correctIndex } = generateMonetaryOptions(totalCost);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on question: If a couch regularly sells for $500 and is being sold at a 35% discount, what is the discounted price?
  private static createDiscountQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const originalPrice = Math.floor(Math.random() * 40) * 10 + 100; // $100-$500, divisible by 10
    const discountPercent = (Math.floor(Math.random() * 7) + 4) * 5; // 20-50% discount (divisible by 5)
    const discountAmount = Math.round((originalPrice * discountPercent) / 100);
    const discountedPrice = originalPrice - discountAmount;

    const question = `If a couch regularly sells for $${originalPrice} and is being sold at a ${discountPercent}% discount, what is the discounted price?`;
    const { options, correctIndex } = generateDollarOptions(discountedPrice);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on question: A group of four numbers has an average (arithmetic mean) of 17. The first three numbers are 9, 32 and 19. What is the other number?
  private static createAverageQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const average = Math.floor(Math.random() * 20) + 10; // 10-30
    const numCount = 4;
    const total = average * numCount;

    // Generate three random numbers
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 30) + 1;
    const num3 = Math.floor(Math.random() * 25) + 1;
    const num4 = total - num1 - num2 - num3;

    const question = `A group of four numbers has an average (arithmetic mean) of ${average}. The first three numbers are ${num1}, ${num2} and ${num3}. What is the other number?`;
    const { options, correctIndex } = generateNumericOptions(num4);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on question: A restaurant sold 250 drinks in a night. Some of the drinks were sold for $2 each and the rest for $5 each. If the total sales of drinks for the night was $830, how many $2 drinks were sold?
  private static createRestaurantSalesQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const totalDrinks = Math.floor(Math.random() * 200) + 200; // 200-400 drinks
    const cheapPrice = 2;
    const expensivePrice = 5;
    const totalSales = Math.floor(Math.random() * 500) + 800; // $800-$1300

    // Calculate how many $2 drinks were sold
    // Let x = number of $2 drinks, y = number of $5 drinks
    // x + y = totalDrinks
    // 2x + 5y = totalSales
    // Solving: y = (totalSales - 2*totalDrinks) / 3
    const expensiveDrinks = Math.floor((totalSales - 2 * totalDrinks) / 3);
    const cheapDrinks = totalDrinks - expensiveDrinks;

    const question = `A restaurant sold ${totalDrinks} drinks in a night. Some of the drinks were sold for $${cheapPrice} each and the rest for $${expensivePrice} each. If the total sales of drinks for the night was $${totalSales}, how many $${cheapPrice} drinks were sold?`;
    const { options, correctIndex } = generateNumericOptions(cheapDrinks);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on question: In one month, a farmer produces 1200 pounds of corn. In the following month, the amount of corn he produces increases by 15% over the previous month. How much corn does he produce in the second month?
  private static createCornProductionQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const firstMonth = Math.floor(Math.random() * 50) * 10 + 1000; // 1000-1500 pounds, divisible by 10
    const increasePercent = Math.floor(Math.random() * 4) * 5 + 10; // 10-30% increase, divisible by 5
    const increaseAmount = Math.round((firstMonth * increasePercent) / 100);
    const secondMonth = firstMonth + increaseAmount;

    const question = `In one month, a farmer produces ${firstMonth} pounds of corn. In the following month, the amount of corn he produces increases by ${increasePercent}% over the previous month. How much corn does he produce in the second month?`;
    const { options, correctIndex } = generateNumericOptions(secondMonth);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on question: A plane loaded with cargo travels 2000 miles at an average speed of 400 miles per hour. On the return trip by the same route, it travels at an average speed of 480 miles per hour. How much quicker was the return trip?
  private static createSpeedDistanceQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const distance = Math.floor(Math.random() * 200) + 100; // 100-300 miles
    const time = Math.floor(Math.random() * 4) + 2; // 2-6 hours
    const speed = Math.round(distance / time);

    const question = `If a train travels ${distance} miles in ${time} hours, what is its average speed?`;
    const { options, correctIndex } = generateNumericOptions(speed);

    return { question, correctAnswer: correctIndex, options };
  }

  // Based on a question: Which of the following is the smallest value?
  private static createDecimalComparisonQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string, string];
  } {
    const isSmallest = Math.random() < 0.5; // Randomly choose smallest or largest
    const { options, correctIndex } =
      generateDecimalComparisonOptions(isSmallest);

    const question = `Which of the following is the ${
      isSmallest ? "smallest" : "largest"
    } value?`;

    return { question, correctAnswer: correctIndex, options };
  }

  // TODO QUESTIONS:
  // 36 is 15% of what number?

  private static createGeometryQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const sideLength = Math.floor(Math.random() * 10) + 5; // 5-15 cm
    const perimeter = sideLength * 4;

    const question = `If the perimeter of a square is ${perimeter} cm, what is the length of one side?`;
    const { options, correctIndex } = generateNumericOptions(sideLength);

    return { question, correctAnswer: correctIndex, options };
  }

  private static createRatioQuestion(): {
    question: string;
    correctAnswer: number;
    options: [string, string, string, string];
  } {
    const unitPrice = Math.random() * 2 + 0.5; // $0.50-$2.50
    const quantity1 = Math.floor(Math.random() * 4) + 3; // 3-6 items
    const totalCost1 = Math.round(unitPrice * quantity1 * 100) / 100;

    // Ensure quantity2 is different from quantity1 and in a different range
    let quantity2;
    do {
      quantity2 = Math.floor(Math.random() * 4) + 7; // 7-10 items
    } while (quantity2 === quantity1);

    const totalCost2 = Math.round(unitPrice * quantity2 * 100) / 100;

    const question = `If ${quantity1} apples cost $${totalCost1.toFixed(
      2
    )}, how much do ${quantity2} apples cost?`;

    // Use dollar options generator to ensure all options are formatted to 2 decimal places
    const { options, correctIndex } = generateDollarOptions(totalCost2);

    return { question, correctAnswer: correctIndex, options };
  }
}
