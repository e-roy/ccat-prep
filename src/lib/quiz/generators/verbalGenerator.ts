import {
  QuizQuestion,
  QuizCategory,
  VerbalQuestion,
  VocabularyWord,
} from "@/types/quiz";
import vocabularyData from "@/data/vocabulary";
import { shuffleArray } from "./helpers";

enum VerbalQuestionType {
  FILL_IN_THE_BLANK = "fill_in_the_blank",
  ANTONYM = "antonym",
}

export class VerbalQuestionGenerator {
  static generateQuestions(count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const shuffledVocabulary = shuffleArray([...vocabularyData]);

    for (let i = 0; i < count && i < shuffledVocabulary.length; i++) {
      const word = shuffledVocabulary[i];

      // Randomly choose question type
      const questionType =
        Math.random() < 0.5
          ? VerbalQuestionType.FILL_IN_THE_BLANK
          : VerbalQuestionType.ANTONYM;

      const question =
        questionType === VerbalQuestionType.FILL_IN_THE_BLANK
          ? this.generateFillInTheBlankQuestion(word)
          : this.generateAntonymQuestion(word);

      questions.push(question);
    }

    return questions;
  }

  private static generateFillInTheBlankQuestion(
    word: VocabularyWord
  ): VerbalQuestion {
    // Create a fill-in-the-blank question using the word's example sentence
    const exampleSentence = word.example;

    // Replace the word with blanks in the example sentence
    const questionText = exampleSentence.replace(
      new RegExp(`\\b${word.word}\\b`, "gi"),
      "____________"
    );

    const options = this.generateDistractors(word);

    return {
      id: `verbal_${Date.now()}_${word.word}`,
      category: QuizCategory.VERBAL_REASONING,
      question: questionText,
      options,
      correctAnswer: options.indexOf(word.word.toLowerCase()),
      vocabularyWord: word.word,
      context: exampleSentence,
    };
  }

  private static generateAntonymQuestion(word: VocabularyWord): VerbalQuestion {
    const questionText = `Choose the word that is most nearly OPPOSITE to the word in capital letters.\n\n${word.word.toUpperCase()}`;

    const options = this.generateAntonymOptions(word);

    return {
      id: `verbal_antonym_${Date.now()}_${word.word}`,
      category: QuizCategory.VERBAL_REASONING,
      question: questionText,
      options,
      correctAnswer: options.indexOf(word.antonym?.toLowerCase() || "opposite"),
      vocabularyWord: word.word,
      context: `Antonym for ${word.word}`,
    };
  }

  private static generateDistractors(targetWord: VocabularyWord): string[] {
    const options = [targetWord.word.toLowerCase()];

    // Get all other words from vocabulary
    const allWords = vocabularyData
      .filter((w) => w.word.toLowerCase() !== targetWord.word.toLowerCase())
      .map((w) => w.word.toLowerCase());

    // Generate distractors that are semantically related but incorrect
    const semanticDistractors = this.selectSemanticDistractors(
      targetWord,
      allWords
    );

    // Add semantic distractors first
    for (const distractor of semanticDistractors) {
      if (!options.includes(distractor)) {
        options.push(distractor);
      }
    }

    // Add random words if we don't have enough distractors
    while (options.length < 5 && allWords.length > 0) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
        allWords.splice(allWords.indexOf(randomWord), 1);
      }
    }

    return shuffleArray(options);
  }

  private static selectSemanticDistractors(
    targetWord: any,
    allWords: string[]
  ): string[] {
    const distractors: string[] = [];
    const targetMeaning = targetWord.meaning.toLowerCase();

    // Look for words with similar meanings (synonyms) or opposite meanings
    for (const word of allWords) {
      const vocabEntry = vocabularyData.find(
        (w) => w.word.toLowerCase() === word
      );
      if (!vocabEntry) continue;

      const meaning = vocabEntry.meaning.toLowerCase();

      // Add words with similar meanings (potential synonyms)
      if (this.hasSimilarMeaning(targetMeaning, meaning)) {
        distractors.push(word);
        if (distractors.length >= 2) break;
      }
    }

    return distractors;
  }

  private static hasSimilarMeaning(
    meaning1: string,
    meaning2: string
  ): boolean {
    // Simple similarity check based on common words
    const words1 = meaning1.split(/\s+/);
    const words2 = meaning2.split(/\s+/);

    // Check for overlapping meaningful words (excluding common words)
    const commonWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ];
    const meaningfulWords1 = words1.filter(
      (w) => !commonWords.includes(w.toLowerCase())
    );
    const meaningfulWords2 = words2.filter(
      (w) => !commonWords.includes(w.toLowerCase())
    );

    const overlap = meaningfulWords1.filter((w) =>
      meaningfulWords2.includes(w)
    );
    return overlap.length > 0;
  }

  private static generateAntonymOptions(targetWord: VocabularyWord): string[] {
    const antonym = targetWord.antonym?.toLowerCase() || "opposite";
    const options = [antonym];

    // Get all other words from vocabulary
    const allWords = vocabularyData
      .filter(
        (w) =>
          w.word.toLowerCase() !== targetWord.word.toLowerCase() &&
          w.word.toLowerCase() !== antonym
      )
      .map((w) => w.word.toLowerCase());

    // Add random words as distractors
    while (options.length < 5 && allWords.length > 0) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
        allWords.splice(allWords.indexOf(randomWord), 1);
      }
    }

    return shuffleArray(options);
  }
}
