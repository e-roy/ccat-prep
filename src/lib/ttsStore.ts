// Simple TTS Store using Zustand for persistent voice selection
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TTSVoice {
  id: string;
  name: string;
  language: string;
  quality: "high" | "medium" | "low";
  localService: boolean;
}

interface TTSStore {
  // Current selection
  selectedVoice: TTSVoice | null;

  // Available voices
  availableVoices: TTSVoice[];

  // Playback state
  isPlaying: boolean;
  currentUtterance: SpeechSynthesisUtterance | null;

  // Actions
  setSelectedVoice: (voice: TTSVoice | null) => void;
  setAvailableVoices: (voices: TTSVoice[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentUtterance: (utterance: SpeechSynthesisUtterance | null) => void;
  stopPlayback: () => void;

  // Helpers
  getSelectedVoice: () => TTSVoice | null;
  isVoiceSelected: (voiceId: string) => boolean;
}

export const useTTSStore = create<TTSStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedVoice: null,
      availableVoices: [],
      isPlaying: false,
      currentUtterance: null,

      // Actions
      setSelectedVoice: (voice) => set({ selectedVoice: voice }),

      setAvailableVoices: (voices) => set({ availableVoices: voices }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),

      setCurrentUtterance: (utterance) => set({ currentUtterance: utterance }),

      stopPlayback: () => {
        // Always cancel speech synthesis regardless of stored utterance
        speechSynthesis.cancel();
        set({ isPlaying: false, currentUtterance: null });
      },

      // Helpers
      getSelectedVoice: () => get().selectedVoice,

      isVoiceSelected: (voiceId: string) => {
        const selected = get().selectedVoice;
        return selected ? selected.id === voiceId : false;
      },
    }),
    {
      name: "tts-voice-store",
      partialize: (state) => ({
        selectedVoice: state.selectedVoice,
      }),
    }
  )
);
