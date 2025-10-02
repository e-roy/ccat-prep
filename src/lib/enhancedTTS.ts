// Enhanced TTS with better voice selection and configuration
// This provides better quality than basic speechSynthesis

interface VoiceInfo {
  name: string;
  lang: string;
  localService: boolean;
  voiceURI: string;
}

class EnhancedTTS {
  private voices: SpeechSynthesisVoice[] = [];
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        console.log("EnhancedTTS: Found", voices.length, "voices");
        console.log("EnhancedTTS: Voices", voices);

        if (voices.length > 0) {
          this.voices = voices;
          this.selectBestVoice();
          this.isInitialized = true;
          resolve();
        }
      };

      // Remove any existing listeners to avoid duplicates
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);

      // Try to load voices immediately
      loadVoices();

      // If no voices found, wait for the voiceschanged event
      if (this.voices.length === 0) {
        speechSynthesis.addEventListener("voiceschanged", loadVoices);

        // Fallback timeout in case voiceschanged never fires
        setTimeout(() => {
          if (!this.isInitialized) {
            console.warn("EnhancedTTS: Timeout waiting for voices");
            this.isInitialized = true;
            resolve();
          }
        }, 2000);
      }
    });
  }

  private selectBestVoice(): void {
    // Prefer high-quality, local voices
    const localVoices = this.voices.filter((voice) => voice.localService);
    const englishVoices = this.voices.filter(
      (voice) => voice.lang.startsWith("en") && voice.localService
    );

    // Priority order for voice selection
    const preferredVoiceNames = [
      "Microsoft Zira Desktop",
      "Microsoft David Desktop",
      "Microsoft Mark Desktop",
      "Google US English",
      "Alex",
      "Samantha",
      "Victoria",
      "Daniel",
      "Moira",
      "Tessa",
    ];

    // Try to find a preferred voice
    for (const voiceName of preferredVoiceNames) {
      const voice = this.voices.find(
        (v) => v.name.includes(voiceName) && v.localService
      );
      if (voice) {
        this.preferredVoice = voice;
        return;
      }
    }

    // Fallback to best available local English voice
    if (englishVoices.length > 0) {
      this.preferredVoice = englishVoices[0];
    } else if (localVoices.length > 0) {
      this.preferredVoice = localVoices[0];
    } else if (this.voices.length > 0) {
      this.preferredVoice = this.voices[0];
    }
  }

  async speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceName?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: SpeechSynthesisErrorEvent) => void;
    } = {}
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Use specified voice or preferred voice
      if (options.voiceName) {
        const selectedVoice = this.voices.find(
          (v) => v.name === options.voiceName
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      // Set speech parameters
      utterance.rate = options.rate ?? 0.8; // Slightly slower for better comprehension
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        // Don't treat "interrupted" as an error - it's normal when stopping playback
        if (event.error !== "interrupted") {
          options.onError?.(event);
          reject(event);
        } else {
          // For interrupted errors, just resolve (don't reject)
          resolve();
        }
      };

      speechSynthesis.speak(utterance);
    });
  }

  getAvailableVoices(): VoiceInfo[] {
    return this.voices.map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService,
      voiceURI: voice.voiceURI,
    }));
  }

  getCurrentVoice(): VoiceInfo | null {
    if (!this.preferredVoice) return null;

    return {
      name: this.preferredVoice.name,
      lang: this.preferredVoice.lang,
      localService: this.preferredVoice.localService,
      voiceURI: this.preferredVoice.voiceURI,
    };
  }

  setPreferredVoice(voiceName: string): boolean {
    const voice = this.voices.find((v) => v.name === voiceName);
    if (voice) {
      this.preferredVoice = voice;
      return true;
    }
    return false;
  }

  stop(): void {
    speechSynthesis.cancel();
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const enhancedTTS = new EnhancedTTS();
