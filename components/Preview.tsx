import React, { useState } from 'react';
import type { Platform, GenerationResult } from '../types';

interface PreviewProps {
  platform: Platform;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  generatedContent: GenerationResult | null;
}

// FIX: This component was not correctly setting a height, causing the image to be invisible.
// It has been updated to use the modern CSS `aspect-ratio` property to correctly size the container.
const AspectRatioContainer: React.FC<{ aspectRatio: string; children: React.ReactNode }> = ({ aspectRatio, children }) => {
  const [w, h] = aspectRatio.split(':');
  
  return (
    <div 
      className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {children}
    </div>
  );
};


export const Preview: React.FC<PreviewProps> = ({ platform, isLoading, loadingMessage, error, generatedContent }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleDownload = () => {
    if (!generatedContent) return;
    const link = document.createElement('a');
    link.href = generatedContent.url;
    const fileExtension = generatedContent.type === 'image' ? 'jpg' : 'mp4';
    const fileName = `${generatedContent.platform.name.replace(' ', '_')}_${new Date().getTime()}.${fileExtension}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCaptions = () => {
    if (!generatedContent) return;
    const { hook, keyMessages, cta } = generatedContent;
    const captionText = [hook, keyMessages, cta].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(captionText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
        setCopySuccess('Failed to copy.');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };
    
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center text-center p-4">
          <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-semibold text-white">Generating Content</p>
          <p className="text-sm text-gray-400">{loadingMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-4 text-center text-red-400">
          <p className="font-bold">Generation Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (generatedContent) {
      if (generatedContent.type === 'image') {
        return <img src={generatedContent.url} alt="Generated content" className="w-full h-full object-contain" />;
      }
      if (generatedContent.type === 'video') {
        return <video src={generatedContent.url} controls autoPlay loop className="w-full h-full object-contain" />;
      }
    }
    return (
      <div className="text-center text-gray-500 p-4">
        <p className="font-semibold">Your generated content will appear here</p>
        <p className="text-sm">Fill out the creative inputs and click "Generate"</p>
      </div>
    );
  };

  const hasCaptions = generatedContent && (generatedContent.hook || generatedContent.keyMessages || generatedContent.cta);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="w-full max-w-md">
           <AspectRatioContainer aspectRatio={platform.aspectRatio}>
             {renderContent()}
           </AspectRatioContainer>
        </div>
      </div>
      {generatedContent && generatedContent.type === 'video' && hasCaptions && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
            <h4 className="font-bold text-white">Video Captions</h4>
            {generatedContent.hook && <p className="text-sm text-gray-300"><strong>Hook:</strong> {generatedContent.hook}</p>}
            {generatedContent.keyMessages && <p className="text-sm text-gray-300 whitespace-pre-wrap"><strong>Messages:</strong> {generatedContent.keyMessages}</p>}
            {generatedContent.cta && <p className="text-sm text-gray-300"><strong>CTA:</strong> {generatedContent.cta}</p>}
             <button
                onClick={handleCopyCaptions}
                className="w-full mt-2 bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
                {copySuccess || 'Copy Captions'}
            </button>
        </div>
      )}
      {generatedContent && !isLoading && (
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Content
        </button>
      )}
    </div>
  );
};