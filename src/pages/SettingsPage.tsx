import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAISettingsStore } from "@/lib/aiStore";
import TTSSettings from "@/components/TTSSettings";
import {
  Key,
  Trash2,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const { settings, setApiKey, clearApiKey, setAIEnabled, getMaskedApiKey } =
    useAISettingsStore();
  const [tempApiKey, setTempApiKey] = useState("");

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setTempApiKey("");
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setTempApiKey("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-2 sm:p-3 lg:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* OpenAI Settings - Ultra Compact */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-3 sm:p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2 pb-2 border-b">
                <Key className="w-4 h-4 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold">
                  OpenAI Settings
                </h2>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Status Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {settings.isConfigured ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-yellow-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        settings.isConfigured
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {settings.isConfigured ? "Ready" : "Setup Needed"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>
                      Requests:{" "}
                      <span className="font-medium">{settings.usageCount}</span>
                    </p>
                    {settings.lastUsed && (
                      <p>
                        Used:{" "}
                        <span className="font-medium">
                          {new Date(settings.lastUsed).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* API Key Section */}
                <div className="sm:col-span-2 lg:col-span-2 space-y-2">
                  {settings.isConfigured ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Key:</span>
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono flex-1 truncate">
                        {getMaskedApiKey()}
                      </code>
                      <Button
                        onClick={handleClearApiKey}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Alert variant="default" className="py-1.5 px-2 text-xs">
                        <Brain className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {settings.isConfigured ? (
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-primary" />
                              <strong>AI Active</strong> - Smart questions ready
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-yellow-600" />
                              <strong>Add API Key</strong> - Enable AI features
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          type="password"
                          value={tempApiKey}
                          onChange={(e) => setTempApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="font-mono text-xs h-8"
                        />
                        <Button
                          onClick={handleSaveApiKey}
                          disabled={!tempApiKey.startsWith("sk-")}
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          Save
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        🔒 Stored locally only
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Toggle */}
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ai-enabled"
                    checked={settings.isEnabled}
                    onCheckedChange={(checked) =>
                      setAIEnabled(checked as boolean)
                    }
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="ai-enabled"
                    className="text-xs font-medium cursor-pointer"
                  >
                    Enable AI Questions
                  </Label>
                  <span
                    className={`text-xs ml-auto ${
                      settings.isEnabled
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {settings.isEnabled ? "● Active" : "○ Disabled"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  {settings.isEnabled
                    ? "Smart personalized questions"
                    : "Standard question bank"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TTS Settings - Minimal */}
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">
                  Voice Settings
                </h3>
              </div>
              <TTSSettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
