import { useAISettingsStore } from "./aiStore";

interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

class OpenAIService {
  private baseUrl = "https://api.openai.com/v1";

  async generateExplanation(
    word: string,
    meaning: string
  ): Promise<AIResponse> {
    const { settings, incrementUsage, updateLastUsed } =
      useAISettingsStore.getState();

    if (!settings.isConfigured) {
      return { success: false, error: "OpenAI API key not configured" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a vocabulary tutor. Provide clear, concise explanations with memory tips.",
            },
            {
              role: "user",
              content: `Explain the word "${word}" with meaning "${meaning}" in simple terms. Include a memory tip.`,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      incrementUsage();
      updateLastUsed();

      return {
        success: true,
        data: data.choices[0].message.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const aiService = new OpenAIService();
