
import React, { useState, useEffect } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Preview } from './components/Preview';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { PLATFORMS } from './constants';
import type { Platform, Suggestion, GeneratedContent } from './types';
import * as geminiService from './services/geminiService';

// Fix: To resolve TypeScript errors related to duplicate declarations of 'aistudio', the `AIStudio` interface has been moved inside the `declare global` block. This ensures it correctly augments the global scope and avoids conflicts.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Fix: Made 'aistudio' optional to resolve a TypeScript declaration conflict. This aligns the type with its runtime usage, where its existence is checked before use.
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
  const [startImageFile, setStartImageFile] = useState<File | null>(null);
  const [endImageFile, setEndImageFile] = useState<File | null>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectApiKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success to avoid race condition and allow immediate generation attempt.
      setIsApiKeySelected(true);
    }
  };

  const handleApiError = (e: any) => {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error(e);
    setError(errorMessage);
    // If the error indicates a missing API key, prompt user to select one again.
    if (errorMessage.includes('Requested entity was not found.')) {
        setIsApiKeySelected(false);
        setError("Your API key is invalid. Please select a valid key to continue.");
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    try {
      const newSuggestions = await geminiService.generateSuggestions(prompt, selectedPlatform);
      setSuggestions(newSuggestions);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateAndDisplayContent = async (
    generator: (prompt: string, platform: Platform, startImg: File | null, endImg: File | null) => Promise<string>,
    type: 'image' | 'video'
  ) => {
    if (!prompt || suggestions.length === 0) {
      setError("Please generate and choose a suggestion first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent([]); // Clear previous content

    try {
      // Use a single generated media URL for all suggestion cards.
      const contentUrl = await generator(prompt, selectedPlatform, startImageFile, endImageFile);
      
      const newContent: GeneratedContent[] = suggestions.map((suggestion, index) => ({
        id: `${type}-${Date.now()}-${index}`,
        url: contentUrl,
        type: type,
        prompt: prompt,
        platform: selectedPlatform,
        ...suggestion,
      }));

      setGeneratedContent(newContent);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = () => {
    generateAndDisplayContent(
        (p, pf) => geminiService.generateImage(p, pf),
        'image'
    );
  };
  
  const handleGenerateVideo = () => {
     generateAndDisplayContent(
        (p, pf, start, end) => geminiService.generateVideo(p, pf, start, end),
        'video'
    );
  };
  
  const handleUpdateSuggestion = (indexToUpdate: number, field: keyof Suggestion, value: string) => {
    const updatedSuggestions = suggestions.map((suggestion, index) => {
      if (index === indexToUpdate) {
        return { ...suggestion, [field]: value };
      }
      return suggestion;
    });
    setSuggestions(updatedSuggestions);
  };


  if (!isApiKeySelected) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">API Key Required</h1>
          <p className="mb-6 text-gray-300">Please select your Gemini API key to use this application.</p>
          <p className="text-xs text-gray-400 mb-4">Video generation with Veo requires a project with billing enabled. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Learn more</a>.</p>
          <button
            onClick={handleSelectApiKey}
            className="bg-cyan-600 text-white font-bold py-2 px-6 hover:bg-cyan-700 transition-colors"
          >
            Select API Key
          </button>
           {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-xl font-bold tracking-tight">AI Social Media Ad Generator</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ControlsPanel
              prompt={prompt}
              setPrompt={setPrompt}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              startImageFile={startImageFile}
              setStartImageFile={setStartImageFile}
              endImageFile={endImageFile}
              setEndImageFile={setEndImageFile}
              onGenerateImage={handleGenerateImage}
              onGenerateVideo={handleGenerateVideo}
              onGenerateSuggestions={handleGenerateSuggestions}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 p-6 border border-gray-700/50 space-y-6">
                <SuggestionsPanel
                  suggestions={suggestions}
                  onUpdateSuggestion={handleUpdateSuggestion}
                  isLoading={isLoading && suggestions.length === 0}
                />
                
                <div>
                    <h3 className="font-bold text-lg text-white">Generated Content</h3>
                    <div className="mt-4 h-[600px]">
                      <Preview
                        generatedContent={generatedContent}
                        isLoading={isLoading && generatedContent.length === 0}
                        platform={selectedPlatform}
                      />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;