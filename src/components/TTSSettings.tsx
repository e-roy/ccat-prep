"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Volume2, RefreshCw } from "lucide-react";
import { enhancedTTS } from "@/lib/enhancedTTS";
import { useTTSStore } from "@/lib/ttsStore";

interface VoiceInfo {
  name: string;
  lang: string;
  localService: boolean;
  voiceURI: string;
}

export default function TTSSettings() {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Zustand store
  const {
    selectedVoice,
    setSelectedVoice,
    setAvailableVoices,
    isPlaying,
    stopPlayback,
  } = useTTSStore();

  useEffect(() => {
    const loadVoices = async () => {
      try {
        await enhancedTTS.initialize();

        const availableVoices = enhancedTTS.getAvailableVoices();
        console.log("TTSSettings: Loaded voices:", availableVoices.length);

        // If no voices found, try again after a short delay
        if (availableVoices.length === 0) {
          console.log("TTSSettings: No voices found, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 500));
          const retryVoices = enhancedTTS.getAvailableVoices();
          console.log("TTSSettings: Retry voices:", retryVoices.length);

          if (retryVoices.length > 0) {
            availableVoices.push(...retryVoices);
          }
        }

        // Convert to store format and save
        const storeVoices = availableVoices.map((voice) => ({
          id: voice.name,
          name: voice.name,
          language: voice.lang,
          quality: voice.localService
            ? "high"
            : ("medium" as "high" | "medium" | "low"),
          localService: voice.localService,
        }));

        console.log("TTSSettings: Store voices:", storeVoices.length);
        setAvailableVoices(storeVoices);
        setVoices(availableVoices);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load voices:", error);
        setIsLoading(false);
      }
    };

    loadVoices();
  }, [setAvailableVoices]);

  const refreshVoices = async () => {
    setIsLoading(true);
    try {
      await enhancedTTS.initialize();

      const availableVoices = enhancedTTS.getAvailableVoices();
      console.log("TTSSettings: Refreshed voices:", availableVoices.length);

      // Convert to store format and save
      const storeVoices = availableVoices.map((voice) => ({
        id: voice.name,
        name: voice.name,
        language: voice.lang,
        quality: voice.localService
          ? "high"
          : ("medium" as "high" | "medium" | "low"),
        localService: voice.localService,
      }));

      setAvailableVoices(storeVoices);
      setVoices(availableVoices);
    } catch (error) {
      console.error("Failed to refresh voices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testVoice = async (voiceName: string) => {
    // Stop any current playback before testing
    if (isPlaying) {
      stopPlayback();
    }

    const testText = "Hello! This is a test of the text-to-speech voice.";
    try {
      await enhancedTTS.speak(testText, {
        voiceName: voiceName,
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
        onError: (error) => {
          // Don't treat "interrupted" as an error - it's normal when stopping playback
          if (error.error !== "interrupted") {
            console.error("TTS test error:", error);
          }
        },
      });
    } catch (error) {
      // Only log non-interrupted errors
      if (
        error instanceof SpeechSynthesisErrorEvent &&
        error.error !== "interrupted"
      ) {
        console.error("TTS test failed:", error);
      }
    }
  };

  const setAsDefault = (voiceName: string) => {
    const success = enhancedTTS.setPreferredVoice(voiceName);
    if (success) {
      // Find the voice in our store format
      const storeVoice = voices.find((v) => v.name === voiceName);
      if (storeVoice) {
        const ttsVoice = {
          id: storeVoice.name,
          name: storeVoice.name,
          language: storeVoice.lang,
          quality: storeVoice.localService
            ? "high"
            : ("medium" as "high" | "medium" | "low"),
          localService: storeVoice.localService,
        };
        setSelectedVoice(ttsVoice);
      }
    }
  };

  const localVoices = voices.filter((voice) => voice.localService);
  const onlineVoices = voices.filter((voice) => !voice.localService);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5 animate-spin" />
            <span>Loading TTS voices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Selection */}
      {selectedVoice && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-800">Current Voice</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-700">{selectedVoice.name}</p>
              <p className="text-sm text-blue-600">{selectedVoice.language}</p>
            </div>
            <Badge
              variant={selectedVoice.localService ? "default" : "secondary"}
            >
              {selectedVoice.localService ? "Local" : "Online"}
            </Badge>
          </div>
        </div>
      )}

      {/* Voice Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Available Voices</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshVoices}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Local Voices */}
        {localVoices.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Local Voices ({localVoices.length}) - Recommended
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {localVoices.map((voice, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedVoice?.id === voice.name
                      ? "bg-green-100 border-green-300"
                      : "bg-white border-gray-200 hover:bg-green-50"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{voice.name}</p>
                    <p className="text-xs text-gray-600">{voice.lang}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testVoice(voice.name)}
                      className="text-xs"
                    >
                      Test
                    </Button>
                    {selectedVoice?.id !== voice.name && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setAsDefault(voice.name)}
                        className="text-xs"
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online Voices */}
        {onlineVoices.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Online Voices ({onlineVoices.length}) - Requires Internet
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {onlineVoices.map((voice, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedVoice?.id === voice.name
                      ? "bg-orange-100 border-orange-300"
                      : "bg-white border-gray-200 hover:bg-orange-50"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{voice.name}</p>
                    <p className="text-xs text-gray-600">{voice.lang}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testVoice(voice.name)}
                      className="text-xs"
                    >
                      Test
                    </Button>
                    {selectedVoice?.id !== voice.name && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setAsDefault(voice.name)}
                        className="text-xs"
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
