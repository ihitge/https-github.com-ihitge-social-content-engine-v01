
import React, { useState, useCallback, useEffect } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Preview } from './components/Preview';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { PLATFORMS } from './constants';
import { generateImage, generateVideo } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { Platform, GenerationType, GenerationResult } from './types';

// Fix: Removed conflicting global declaration for `window.aistudio`.
// The environment provides this, and re-declaring it causes an error.

const App: React.FC = () => {
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [startImage, setStartImage] = useState<{ file: File; base64: string; } | null>(null);
  const [endImage, setEndImage] = useState<{ file: File; base64: string; } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GenerationResult | null>(null);
  
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [apiKeyMessage, setApiKeyMessage] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleFileChange = async (file: File | null, type: 'start' | 'end') => {
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'start') {
        setStartImage({ file, base64 });
      } else {
        setEndImage({ file, base64 });
      }
    } else {
      if (type === 'start') {
        setStartImage(null);
      } else {
        setEndImage(null);
      }
    }
  };

  const handleGenerate = useCallback(async (platform: Platform = selectedPlatform) => {
    setError(null);
    setApiKeyMessage(null);

    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    
    if (generationType === 'video') {
      await checkApiKey();
      if (!apiKeySelected) {
         if (window.aistudio) {
          await window.aistudio.openSelectKey();
          setApiKeySelected(true); // Optimistically set to true
          setApiKeyMessage("API Key selected. You can now generate your video!");
        } else {
            setError("Video generation API is not available.");
        }
        return;
      }
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      let resultUrl: string;
      if (generationType === 'image') {
        setLoadingMessage('Generating your image...');
        const base64Image = await generateImage(prompt, platform.aspectRatio);
        resultUrl = `data:image/jpeg;base64,${base64Image}`;
      } else { // video
        setLoadingMessage('Initializing video generation...');
        const videoUri = await generateVideo({
          prompt,
          startImage: startImage?.base64 || null,
          endImage: endImage?.base64 || null,
          aspectRatio: platform.aspectRatio,
          resolution: platform.resolution,
          onProgress: setLoadingMessage,
        });
        const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        resultUrl = URL.createObjectURL(blob);
      }
      setGeneratedContent({ type: generationType, url: resultUrl, platform, prompt });
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
       if (generationType === 'video' && errorMessage.includes('Requested entity was not found')) {
        setError("Your API key is invalid or not found. Please select a valid key and try again.");
        setApiKeySelected(false);
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, generationType, selectedPlatform, startImage, endImage, apiKeySelected, checkApiKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Social Media Content Factory
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            AI-powered content generation for all your social platforms.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ControlsPanel
              generationType={generationType}
              setGenerationType={setGenerationType}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              prompt={prompt}
              setPrompt={setPrompt}
              onFileChange={handleFileChange}
              onGenerate={() => handleGenerate(selectedPlatform)}
              isLoading={isLoading}
              startImageFile={startImage?.file || null}
              endImageFile={endImage?.file || null}
              apiKeyMessage={apiKeyMessage}
            />
          </div>

          <div className="lg:col-span-6">
            <Preview
              platform={selectedPlatform}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
              generatedContent={generatedContent}
            />
          </div>

          <div className="lg:col-span-3">
             <SuggestionsPanel
                currentResult={generatedContent}
                onGenerateVariant={handleGenerate}
                isLoading={isLoading}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
