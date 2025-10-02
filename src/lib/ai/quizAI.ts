import { QuizQuestion, QuizCategory } from "@/types/quiz";
import { useAISettingsStore } from "@/lib/aiStore";
import vocabularyData from "@/data/vocabulary";
import OpenAI from "openai";

export interface AIQuestionResponse {
  success: boolean;
  questions?: QuizQuestion[];
  error?: string;
}

export class QuizAI {
  private openai: OpenAI;

  constructor() {
    const { settings } = useAISettingsStore.getState();
    this.openai = new OpenAI({
      apiKey: settings.openaiApiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
      timeout: 30000, // 30 second timeout
    });
  }

  async generateQuizQuestions(
    categories: QuizCategory[]
  ): Promise<AIQuestionResponse> {
    const { settings, incrementUsage, updateLastUsed } =
      useAISettingsStore.getState();

    // Check if AI is enabled
    if (!settings.isEnabled) {
      return {
        success: false,
        error:
          "AI question generation is disabled. Please enable it in Settings to use AI-generated questions.",
      };
    }

    if (!settings.isConfigured) {
      return {
        success: false,
        error:
          "OpenAI API key not configured. Please set your API key in Settings.",
      };
    }

    try {
      const questions: QuizQuestion[] = [];

      // Calculate questions per category
      const enabledCategories = categories.filter(
        (cat) => cat !== QuizCategory.SPATIAL_REASONING
      );
      const questionsPerCategory = Math.floor(50 / enabledCategories.length);
      const extraQuestions =
        50 - questionsPerCategory * enabledCategories.length;

      // Generate questions for each category
      for (let i = 0; i < enabledCategories.length; i++) {
        const category = enabledCategories[i];
        const count = questionsPerCategory + (i < extraQuestions ? 1 : 0);

        try {
          const categoryQuestions = await this.generateCategoryQuestions(
            category,
            count
          );
          questions.push(...categoryQuestions);
        } catch (categoryError) {
          console.error(
            `QuizAI: Failed to generate ${category} questions:`,
            categoryError
          );
          // Continue with other categories instead of failing completely
        }
      }

      if (questions.length === 0) {
        throw new Error("No questions were generated from any category");
      }

      // Shuffle questions to mix categories
      const shuffledQuestions = this.shuffleArray(questions);

      incrementUsage();
      updateLastUsed();

      return {
        success: true,
        questions: shuffledQuestions,
      };
    } catch (error) {
      console.error("QuizAI: Error in generateQuizQuestions:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate questions",
      };
    }
  }

  private async generateCategoryQuestions(
    category: QuizCategory,
    count: number
  ): Promise<QuizQuestion[]> {
    switch (category) {
      case QuizCategory.MATH:
        return this.generateMathQuestions(count);
      case QuizCategory.VERBAL_REASONING:
        return this.generateVerbalQuestions(count);
      case QuizCategory.LOGICAL_REASONING:
        return this.generateLogicalQuestions(count);
      case QuizCategory.SPATIAL_REASONING:
        return this.generateSpatialQuestions(count);
      default:
        return [];
    }
  }

  private async generateMathQuestions(count: number): Promise<QuizQuestion[]> {
    const prompt = `Generate ${count} CCAT-style math questions with exactly 4 multiple choice options each. 
    Include a mix of:
    - Basic arithmetic (addition, subtraction, multiplication, division)
    - Word problems (speed, percentages, geometry, ratios)
    - Simple algebra (solving for x)
    - Number sequences and patterns
    
    Format each question as JSON with this exact structure:
    {
      "question": "What is 15 + 27?",
      "options": ["40", "42", "41", "43"],
      "correctAnswer": 1,
    }
    
    Return ONLY a valid JSON array of ${count} question objects. No additional text.`;

    return this.callOpenAI(prompt, QuizCategory.MATH, count);
  }

  private async generateVerbalQuestions(
    count: number
  ): Promise<QuizQuestion[]> {
    // Get random vocabulary words (limit to 6 to avoid overly long prompts)
    const shuffledVocabulary = this.shuffleArray([...vocabularyData]);
    const selectedWords = shuffledVocabulary.slice(0, Math.min(count, 6));

    const vocabularyList = selectedWords
      .map(
        (word) =>
          `"${word.word}": "${word.meaning}"${
            word.antonym ? ` (antonym: ${word.antonym})` : ""
          }`
      )
      .join(", ");

    const prompt = `Generate ${count} CCAT-style verbal reasoning questions using these vocabulary words: ${vocabularyList}

Create questions testing:
- Word meaning and definition
- Context usage and comprehension
- Synonyms and antonyms
- Reading comprehension

Format each question as JSON:
{
  "question": "What is the meaning of 'ubiquitous'?",
  "options": ["Rare", "Present everywhere", "Expensive", "Difficult"],
  "correctAnswer": 1,
  "vocabularyWord": "ubiquitous",
  "context": "Smartphones are ubiquitous in modern society."
}

Return ONLY a valid JSON array of ${count} question objects. No additional text.`;

    return this.callOpenAI(prompt, QuizCategory.VERBAL_REASONING, count, 45000); // 45 second timeout for verbal questions
  }

  private async generateLogicalQuestions(
    count: number
  ): Promise<QuizQuestion[]> {
    const prompt = `Generate ${count} CCAT-style logical reasoning questions with exactly 4 multiple choice options each.
    Include a mix of:
    - Pattern recognition (number sequences, letter sequences, visual patterns)
    - Logic puzzles and syllogisms
    - Deductive reasoning
    - Analogies and relationships

    Format each question as JSON with this exact structure:
    {
      "question": "What comes next in the sequence: 2, 4, 8, 16, ?",
      "options": ["24", "32", "20", "28"],
      "correctAnswer": 1,
    }

    Return ONLY a valid JSON array of ${count} question objects. No additional text.`;

    return this.callOpenAI(
      prompt,
      QuizCategory.LOGICAL_REASONING,
      count,
      30000
    ); // 30 second timeout for logical reasoning with newer models
  }

  private async generateSpatialQuestions(
    _count: number
  ): Promise<QuizQuestion[]> {
    // Placeholder for spatial reasoning - return empty array for now
    return [];
  }

  private async callOpenAI(
    prompt: string,
    category: QuizCategory,
    _count: number,
    timeout: number = 30000
  ): Promise<QuizQuestion[]> {
    try {
      // Create a promise with timeout for the OpenAI request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), timeout);
      });

      const completionPromise = this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at creating CCAT-style cognitive assessment questions. You must return only valid JSON arrays. Do not include any markdown formatting, explanations, or additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const completion = (await Promise.race([
        completionPromise,
        timeoutPromise,
      ])) as any;

      const content = completion.choices[0].message.content;

      if (!content) {
        throw new Error("No content received from OpenAI API");
      }

      try {
        // Clean the response content - remove any markdown formatting
        let cleanedContent = content.trim();

        // Remove markdown code block formatting if present
        if (cleanedContent.startsWith("```json")) {
          cleanedContent = cleanedContent
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (cleanedContent.startsWith("```")) {
          cleanedContent = cleanedContent
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }

        const questions = JSON.parse(cleanedContent);

        if (!Array.isArray(questions)) {
          throw new Error(
            `Expected array of questions, got: ${typeof questions}`
          );
        }

        // Validate and format questions
        return questions.map(
          (
            q: {
              question: string;
              options: [string, string, string, string];
              correctAnswer: number;
              vocabularyWord?: string;
              context?: string;
            },
            index: number
          ) => {
            // Validate required fields
            if (
              !q.question ||
              !q.options ||
              !Array.isArray(q.options) ||
              q.options.length !== 4
            ) {
              throw new Error(
                `Invalid question format at index ${index}: missing question or options`
              );
            }

            if (
              typeof q.correctAnswer !== "number" ||
              q.correctAnswer < 0 ||
              q.correctAnswer > 3
            ) {
              throw new Error(
                `Invalid correctAnswer at index ${index}: must be 0-3`
              );
            }

            return {
              id: `${category}_ai_${Date.now()}_${index}`,
              category,
              question: q.question.trim(),
              options: q.options.map((opt) => String(opt).trim()),
              correctAnswer: q.correctAnswer,
              ...(category === QuizCategory.VERBAL_REASONING && {
                vocabularyWord: q.vocabularyWord,
                context: q.context,
              }),
            };
          }
        ) as QuizQuestion[];
      } catch (parseError) {
        throw new Error(`Failed to parse OpenAI response: ${parseError}`);
      }
    } catch (error: any) {
      // Handle OpenAI SDK errors with more detail
      if (
        error.message === "Request timeout" ||
        error.message?.includes("timeout")
      ) {
        throw new Error(`Request timeout: OpenAI API took too long to respond`);
      }

      if (error.response) {
        // Server responded with error status
        throw new Error(
          `OpenAI API request failed: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new Error(`No response from OpenAI API`);
      }

      // Re-throw other errors
      throw error;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Fallback method to generate questions locally if AI fails
  async generateFallbackQuestions(
    categories: QuizCategory[]
  ): Promise<QuizQuestion[]> {
    const { QuestionGenerator } = await import("@/lib/quiz/questionGenerator");
    const questions = QuestionGenerator.generateQuizQuestions(categories);
    return questions;
  }
}
