import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AISettings {
  openaiApiKey: string;
  isConfigured: boolean;
  isEnabled: boolean;
  lastUsed: string | null;
  usageCount: number;
}

interface AISettingsStore {
  // State
  settings: AISettings;

  // Actions
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  setAIEnabled: (enabled: boolean) => void;
  incrementUsage: () => void;
  updateLastUsed: () => void;

  // Helpers
  isApiKeyValid: () => boolean;
  getMaskedApiKey: () => string;
}

export const useAISettingsStore = create<AISettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        openaiApiKey: "",
        isConfigured: false,
        isEnabled: true,
        lastUsed: null,
        usageCount: 0,
      },

      setApiKey: (key: string) => {
        const isConfigured = key.startsWith("sk-") && key.length > 20;
        set({
          settings: {
            ...get().settings,
            openaiApiKey: key,
            isConfigured,
          },
        });
      },

      clearApiKey: () => {
        set({
          settings: {
            ...get().settings,
            openaiApiKey: "",
            isConfigured: false,
          },
        });
      },

      setAIEnabled: (enabled: boolean) => {
        set({
          settings: {
            ...get().settings,
            isEnabled: enabled,
          },
        });
      },

      incrementUsage: () => {
        set({
          settings: {
            ...get().settings,
            usageCount: get().settings.usageCount + 1,
          },
        });
      },

      updateLastUsed: () => {
        set({
          settings: {
            ...get().settings,
            lastUsed: new Date().toISOString(),
          },
        });
      },

      isApiKeyValid: () => {
        const { openaiApiKey } = get().settings;
        return openaiApiKey.startsWith("sk-") && openaiApiKey.length > 20;
      },

      getMaskedApiKey: () => {
        const { openaiApiKey } = get().settings;
        if (!openaiApiKey) return "";
        return `${openaiApiKey.slice(0, 8)}...${openaiApiKey.slice(-4)}`;
      },
    }),
    {
      name: "ai-settings-store",
      partialize: (state) => ({
        settings: {
          openaiApiKey: state.settings.openaiApiKey,
          isConfigured: state.settings.isConfigured,
          isEnabled: state.settings.isEnabled,
          lastUsed: state.settings.lastUsed,
          usageCount: state.settings.usageCount,
        },
      }),
    }
  )
);
