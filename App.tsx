import React, { useState, useCallback, useEffect } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Preview } from './components/Preview';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { PLATFORMS } from './constants';
import { generateImage, generateVideo } from './services/geminiService';
import { fileToBase64, addTextOverlayToImage } from './utils/fileUtils';
import type { Platform, GenerationType, GenerationResult } from './types';

const App: React.FC = () => {
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0]);
  const [prompt, setPrompt] = useState<string>('');
  const [startImage, setStartImage] = useState<{ file: File; base64: string; } | null>(null);
  const [endImage, setEndImage] = useState<{ file: File; base64: string; } | null>(null);
  
  // State for text overlays
  const [hook, setHook] = useState('');
  const [keyMessages, setKeyMessages] = useState('');
  const [cta, setCta] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GenerationResult | null>(null);
  
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [apiKeyMessage, setApiKeyMessage] = useState<string | null>(null);

  const checkApiKeyOnLoad = useCallback(async () => {
    if (generationType === 'video' && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeySelected(hasKey);
    }
  }, [generationType]);

  useEffect(() => {
    checkApiKeyOnLoad();
  }, [checkApiKeyOnLoad]);

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
      setError("Please enter a visual prompt.");
      return;
    }

    if (generationType === 'video') {
        let hasKey = apiKeySelected;
        if (!hasKey && window.aistudio) {
            hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                    await window.aistudio.openSelectKey();
                    hasKey = await window.aistudio.hasSelectedApiKey();
                } catch (e) {
                    console.error("Error opening API key selector:", e);
                    setError("Could not open the API key selector.");
                    return;
                }
            }
        }
        
        if (!hasKey) {
            setError("An API Key is required for video generation. Please select a key and try again.");
            setApiKeySelected(false);
            return;
        }
        
        setApiKeySelected(true);
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      let resultUrl: string;
      const textOverlays = { hook, keyMessages, cta };

      if (generationType === 'image') {
        setLoadingMessage('Generating your image...');
        const base64Image = await generateImage(prompt, platform.aspectRatio);
        const base64ImageUrl = `data:image/jpeg;base64,${base64Image}`;
        
        if (hook || keyMessages || cta) {
          setLoadingMessage('Adding text overlays...');
          resultUrl = await addTextOverlayToImage(base64ImageUrl, textOverlays);
        } else {
          resultUrl = base64ImageUrl;
        }

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

      setGeneratedContent({ type: generationType, url: resultUrl, platform, prompt, ...textOverlays });

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
  }, [prompt, generationType, selectedPlatform, startImage, endImage, apiKeySelected, hook, keyMessages, cta]);

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
              hook={hook}
              setHook={setHook}
              keyMessages={keyMessages}
              setKeyMessages={setKeyMessages}
              cta={cta}
              setCta={setCta}
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