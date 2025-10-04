"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Square,
  Play,
} from "lucide-react";
import { enhancedTTS } from "@/lib/enhancedTTS";
import { useTTSStore } from "@/lib/ttsStore";

interface Word {
  word: string;
  meaning: string;
  example: string;
}

interface VocabularyCardProps {
  words: Word[];
}

export default function VocabularyCard({ words }: VocabularyCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState(words);
  const [isShuffled, setIsShuffled] = useState(false);

  // Get selected voice and playback state from Zustand store
  const {
    selectedVoice,
    isPlaying,
    setIsPlaying,
    setCurrentUtterance,
    stopPlayback,
  } = useTTSStore();

  const currentWord = shuffledWords[currentIndex];

  const nextWord = useCallback(() => {
    // Stop any current playback when navigating
    if (isPlaying) {
      stopPlayback();
    }
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  }, [shuffledWords.length, isPlaying, stopPlayback]);

  const prevWord = useCallback(() => {
    // Stop any current playback when navigating
    if (isPlaying) {
      stopPlayback();
    }
    setCurrentIndex(
      (prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length
    );
  }, [shuffledWords.length, isPlaying, stopPlayback]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevWord();
      } else if (event.key === "ArrowRight") {
        nextWord();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextWord, prevWord]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback(); // Always stop on unmount regardless of state
    };
  }, [stopPlayback]);

  const shuffleWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setIsShuffled(true);
  };

  const resetOrder = () => {
    setShuffledWords(words);
    setCurrentIndex(0);
    setIsShuffled(false);
  };

  const playWordAudio = async () => {
    // If already playing, stop current playback first
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const fullText = `${currentWord.word}. ... ${currentWord.meaning}. Example: ${currentWord.example}`;

    try {
      // Set playing state
      setIsPlaying(true);

      await enhancedTTS.speak(fullText, {
        voiceName: selectedVoice?.name, // Use selected voice from store
        pauseBetweenSections: true, // Add longer pauses for better iOS compatibility
        // Platform-optimized settings are handled by enhancedTTS

        onStart: () => {
          setIsPlaying(true);
        },

        onEnd: () => {
          setIsPlaying(false);
          setCurrentUtterance(null);
        },

        onError: (error) => {
          // Don't treat "interrupted" as an error - it's normal when stopping playback
          if (error.error !== "interrupted") {
            console.error("TTS error:", error);
          }
          setIsPlaying(false);
          setCurrentUtterance(null);
        },
      });
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
      setCurrentUtterance(null);

      // Fallback to basic TTS with platform-optimized settings
      if ("speechSynthesis" in window) {
        // Add longer pauses for better iOS compatibility
        const processedText = fullText.replace(/\.\s+/g, ". ... ");
        const utterance = new SpeechSynthesisUtterance(processedText);

        // Platform-optimized settings for better clarity
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        utterance.rate = isIOS ? 0.6 : 0.8; // Slower on iOS for better clarity
        utterance.pitch = isIOS ? 0.9 : 1.0; // Slightly lower pitch on iOS
        utterance.volume = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentUtterance(null);
        };
        utterance.onerror = (error) => {
          // Don't treat "interrupted" as an error - it's normal when stopping playback
          if (error.error !== "interrupted") {
            console.error("TTS error:", error);
          }
          setIsPlaying(false);
          setCurrentUtterance(null);
        };

        setCurrentUtterance(utterance);
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 py-0 overflow-hidden flex flex-col">
        {/* Header with word - Fixed height */}
        <div className="p-4 h-40 flex flex-col justify-center">
          {/* Progress Badge */}
          <div className="flex justify-center mb-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-secondary/20 border-secondary/30 text-sm"
            >
              {currentIndex + 1} of {shuffledWords.length}
            </Badge>
          </div>

          {/* Word Display */}
          <div className="text-center flex-1 flex items-center justify-center">
            <CardTitle className="text-4xl sm:text-5xl font-bold leading-tight">
              {currentWord.word}
            </CardTitle>
          </div>
        </div>
        {/* Content Section - Flexible height */}
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex-1 flex flex-col space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 flex-1 flex flex-col min-h-0">
              <h3 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Definition
              </h3>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed flex-1 overflow-y-auto">
                {currentWord.meaning}
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-4 rounded-xl border border-emerald-200 flex-1 flex flex-col min-h-0">
              <h3 className="text-base font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Example
              </h3>
              <p className="text-slate-700 text-base md:text-lg lg:text-xl leading-relaxed italic flex-1 overflow-y-auto">
                &ldquo;{currentWord.example}&rdquo;
              </p>
            </div>
          </div>
        </CardContent>

        {/* Audio Player Controls at Bottom - Fixed height */}
        <div className="bg-gradient-to-r from-muted to-muted/80 border-t border-border p-4 h-20 flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Shuffle Control - Far Left */}
            <Button
              onClick={isShuffled ? resetOrder : shuffleWords}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-accent"
            >
              {isShuffled ? (
                <RotateCcw className="w-5 h-5" />
              ) : (
                <Shuffle className="w-5 h-5" />
              )}
            </Button>

            {/* Center Controls: Left, Playback, Right */}
            <div className="flex items-center gap-6">
              <Button
                onClick={prevWord}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-accent"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                onClick={playWordAudio}
                variant={isPlaying ? "destructive" : "default"}
                size="lg"
                className={`rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isPlaying
                    ? "bg-destructive hover:bg-destructive/80"
                    : "bg-primary hover:bg-primary/80"
                }`}
              >
                {isPlaying ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              <Button
                onClick={nextWord}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-accent"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Empty space for balance */}
            <div className="w-10"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
