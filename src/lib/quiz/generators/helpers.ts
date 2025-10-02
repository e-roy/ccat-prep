/**
 * Common helper functions for quiz question generators
 */

export interface OptionResult {
  options: string[];
  correctIndex: number;
}

export interface OptionResult4 {
  options: [string, string, string, string];
  correctIndex: number;
}

export interface OptionResult5 {
  options: [string, string, string, string, string];
  correctIndex: number;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates multiple choice options for numeric answers
 * @param correctAnswer The correct numeric answer
 * @param optionCount Number of options to generate (default: 4)
 * @returns Object with shuffled options and correct index
 */
export function generateNumericOptions(
  correctAnswer: number,
  optionCount: number = 4
): OptionResult4 {
  const options = [correctAnswer.toString()];
  let attempts = 0;
  const maxAttempts = 100;

  // Generate incorrect options with reasonable variations
  while (options.length < optionCount && attempts < maxAttempts) {
    attempts++;
    let variation: number;

    if (correctAnswer < 10) {
      variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
    } else if (correctAnswer < 100) {
      variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    } else {
      variation = Math.floor(Math.random() * 40) - 20; // -20 to +20
    }

    const option = correctAnswer + variation;

    if (
      option !== correctAnswer &&
      option > 0 &&
      !options.includes(option.toString())
    ) {
      options.push(option.toString());
    }
  }

  // If we couldn't generate enough options, fill with simple variations
  while (options.length < optionCount) {
    const simpleOption = correctAnswer + options.length;
    if (!options.includes(simpleOption.toString())) {
      options.push(simpleOption.toString());
    } else {
      options.push((correctAnswer - options.length).toString());
    }
  }

  const shuffledOptions = shuffleArray(options) as [
    string,
    string,
    string,
    string
  ];
  const correctIndex = shuffledOptions.findIndex(
    (option) => option === correctAnswer.toString()
  );

  return { options: shuffledOptions, correctIndex };
}

/**
 * Generates multiple choice options for monetary amounts (cents to dollars)
 * @param correctAnswerCents The correct answer in cents
 * @param optionCount Number of options to generate (default: 4)
 * @returns Object with shuffled options and correct index
 */
export function generateMonetaryOptions(
  correctAnswerCents: number,
  optionCount: number = 4
): OptionResult4 {
  const formatCentsToDollars = (cents: number): string => {
    const dollars = cents / 100;
    return `$${dollars.toFixed(2)}`;
  };

  const options = [formatCentsToDollars(correctAnswerCents)];
  let attempts = 0;
  const maxAttempts = 100;

  // Generate incorrect options with reasonable variations
  while (options.length < optionCount && attempts < maxAttempts) {
    attempts++;
    let variation: number;

    if (correctAnswerCents < 100) {
      variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    } else if (correctAnswerCents < 500) {
      variation = Math.floor(Math.random() * 50) - 25; // -25 to +25
    } else {
      variation = Math.floor(Math.random() * 100) - 50; // -50 to +50
    }

    const option = correctAnswerCents + variation;

    if (
      option !== correctAnswerCents &&
      option > 0 &&
      !options.includes(formatCentsToDollars(option))
    ) {
      options.push(formatCentsToDollars(option));
    }
  }

  // If we couldn't generate enough options, fill with simple variations
  while (options.length < optionCount) {
    const simpleOption = correctAnswerCents + options.length * 10;
    if (!options.includes(formatCentsToDollars(simpleOption))) {
      options.push(formatCentsToDollars(simpleOption));
    } else {
      options.push(
        formatCentsToDollars(correctAnswerCents - options.length * 10)
      );
    }
  }

  const shuffledOptions = shuffleArray(options) as [
    string,
    string,
    string,
    string
  ];
  const correctIndex = shuffledOptions.findIndex(
    (option) => option === formatCentsToDollars(correctAnswerCents)
  );

  return { options: shuffledOptions, correctIndex };
}

/**
 * Generates multiple choice options for dollar amounts with 2 decimal places
 * @param correctAnswerDollars The correct answer in dollars
 * @param optionCount Number of options to generate (default: 4)
 * @returns Object with shuffled options and correct index
 */
export function generateDollarOptions(
  correctAnswerDollars: number,
  optionCount: number = 4
): OptionResult4 {
  const formatDollars = (dollars: number): string => {
    return `$${dollars.toFixed(2)}`;
  };

  const options = [formatDollars(correctAnswerDollars)];
  let attempts = 0;
  const maxAttempts = 100;

  // Generate incorrect options with reasonable variations
  while (options.length < optionCount && attempts < maxAttempts) {
    attempts++;
    let variation: number;

    if (correctAnswerDollars < 10) {
      variation = Math.floor(Math.random() * 4) - 2; // -2 to +2
    } else if (correctAnswerDollars < 50) {
      variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    } else {
      variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    }

    const option = correctAnswerDollars + variation;

    if (
      option !== correctAnswerDollars &&
      option > 0 &&
      !options.includes(formatDollars(option))
    ) {
      options.push(formatDollars(option));
    }
  }

  // If we couldn't generate enough options, fill with simple variations
  while (options.length < optionCount) {
    const simpleOption = correctAnswerDollars + options.length * 2;
    if (!options.includes(formatDollars(simpleOption))) {
      options.push(formatDollars(simpleOption));
    } else {
      options.push(formatDollars(correctAnswerDollars - options.length * 2));
    }
  }

  const shuffledOptions = shuffleArray(options) as [
    string,
    string,
    string,
    string
  ];
  const correctIndex = shuffledOptions.findIndex(
    (option) => option === formatDollars(correctAnswerDollars)
  );

  return { options: shuffledOptions, correctIndex };
}

/**
 * Generates decimal comparison options (smallest/largest value)
 * @param isSmallest Whether to find smallest (true) or largest (false) value
 * @param optionCount Number of options to generate (default: 5)
 * @param maxValue Maximum value for decimals (default: 3)
 * @param decimalPlaces Number of decimal places (default: 3)
 * @returns Object with shuffled options and correct index
 */
export function generateDecimalComparisonOptions(
  isSmallest: boolean,
  optionCount: number = 5,
  maxValue: number = 3,
  decimalPlaces: number = 3
): OptionResult5 {
  // Generate decimal numbers with specified precision
  const generateDecimal = (): string => {
    const wholePart = Math.floor(Math.random() * (maxValue + 1)); // 0 to maxValue
    const decimalPart = Math.floor(Math.random() * Math.pow(10, decimalPlaces));
    return `${wholePart}.${decimalPart
      .toString()
      .padStart(decimalPlaces, "0")}`;
  };

  const decimals: string[] = [];
  let attempts = 0;
  const maxAttempts = 100;

  // Generate unique decimal numbers
  while (decimals.length < optionCount && attempts < maxAttempts) {
    attempts++;
    const decimal = generateDecimal();
    if (!decimals.includes(decimal)) {
      decimals.push(decimal);
    }
  }

  // If we couldn't generate enough unique decimals, fill with simple variations
  while (decimals.length < optionCount) {
    const simpleDecimal = `${decimals.length * 0.5}.${"0".repeat(
      decimalPlaces
    )}`;
    if (!decimals.includes(simpleDecimal)) {
      decimals.push(simpleDecimal);
    } else {
      decimals.push(`${decimals.length * 0.25}.${"0".repeat(decimalPlaces)}`);
    }
  }

  // Convert to numbers for sorting, then back to formatted strings
  const decimalNumbers = decimals.map((d) => parseFloat(d));
  const sortedDecimals = [...decimalNumbers].sort((a, b) => a - b);
  const targetValue = isSmallest
    ? sortedDecimals[0]
    : sortedDecimals[optionCount - 1];

  // Format all decimals, removing trailing zeros
  const formattedOptions = decimals.map((decimal) => {
    const num = parseFloat(decimal);
    return (
      num.toFixed(decimalPlaces).replace(/\.?0+$/, "") ||
      num.toFixed(decimalPlaces)
    );
  });

  const shuffledOptions = shuffleArray(formattedOptions) as [
    string,
    string,
    string,
    string,
    string
  ];
  const correctIndex = shuffledOptions.findIndex(
    (option) => parseFloat(option) === targetValue
  );

  return { options: shuffledOptions, correctIndex };
}

/**
 * Generates a random integer within a range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random number within a range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @returns Random number
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Rounds a number to specified decimal places
 * @param num Number to round
 * @param places Number of decimal places
 * @returns Rounded number
 */
export function roundToPlaces(num: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}
