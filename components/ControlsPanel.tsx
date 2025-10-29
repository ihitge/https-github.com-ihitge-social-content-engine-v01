
import React from 'react';
import type { Platform, AdStyle } from '../types';
import { PLATFORMS } from '../constants';

interface ControlsPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedPlatform: Platform;
  setSelectedPlatform: (platform: Platform) => void;
  adStyle: AdStyle;
  setAdStyle: (style: AdStyle) => void;
  startImageFile: File | null;
  setStartImageFile: (file: File | null) => void;
  endImageFile: File | null;
  setEndImageFile: (file: File | null) => void;
  onGenerateImage: () => void;
  onGenerateVideo: () => void;
  onGenerateSuggestions: () => void;
  isLoading: boolean;
}

const FileInput: React.FC<{
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  disabled: boolean;
}> = ({ label, file, setFile, disabled }) => {
  const id = `file-input-${label.toLowerCase().replace(' ', '-')}`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="hidden"
          disabled={disabled}
        />
        <label htmlFor={id} className={`flex-grow text-center text-sm px-3 py-2 border border-[#0FF4C6] cursor-pointer transition-colors ${disabled ? 'bg-[#1e1e1e] text-gray-500 cursor-not-allowed' : 'bg-[#252525] hover:bg-[#333333] text-gray-300'}`}>
          {file ? file.name : 'Choose file...'}
        </label>
        {file && (
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white" disabled={disabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  prompt,
  setPrompt,
  selectedPlatform,
  setSelectedPlatform,
  adStyle,
  setAdStyle,
  startImageFile,
  setStartImageFile,
  endImageFile,
  setEndImageFile,
  onGenerateImage,
  onGenerateVideo,
  onGenerateSuggestions,
  isLoading,
}) => {

  const adStyles: { id: AdStyle, name: string }[] = [
    { id: 'polished', name: 'Polished' },
    { id: 'native_tiktok', name: 'Native TikTok' },
    { id: 'ugc_testimonial', name: 'UGC/Testimonial' }
  ];

  return (
    <div className="bg-[#252525]/50 p-6 border border-[#0FF4C6]/50 space-y-6">
      {/* --- Section 1: Creative Input --- */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-bold text-white mb-2">
          1. Visual Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic sports car speeding through a neon-lit city at night"
          rows={4}
          className="w-full bg-[#030E0F] text-white border-[#0FF4C6] p-2 focus:ring-2 focus:ring-[#0FF4C6] focus:border-[#0FF4C6] transition"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">2. Platform</label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform)}
              disabled={isLoading}
              className={`flex flex-col items-center justify-center p-2 transition-all duration-200 border-2 ${
                selectedPlatform.id === platform.id
                  ? 'bg-[#0FF4C6]/20 border-[#0FF4C6]'
                  : 'bg-[#1e1e1e]/50 border-transparent hover:border-[#0FF4C6]'
              }`}
            >
              <platform.icon className="w-5 h-5 mb-1 text-white" />
              <span className="text-xs text-center text-white">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">3. Ad Style (Images Only)</label>
        <div className="grid grid-cols-3 gap-2">
          {adStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setAdStyle(style.id)}
              disabled={isLoading}
              className={`p-2 transition-all duration-200 border-2 text-xs text-center text-white ${
                adStyle === style.id
                  ? 'bg-[#0FF4C6]/20 border-[#0FF4C6]'
                  : 'bg-[#1e1e1e]/50 border-transparent hover:border-[#0FF4C6]'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerateSuggestions}
        disabled={isLoading || !prompt}
        className="w-full bg-[#333333] text-[#0FF4C6] font-semibold py-2 px-4 hover:bg-[#404040] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        4. Generate Test Ideas
      </button>
      
      {/* --- Section 2: Final Generation --- */}
      <div className="space-y-6 pt-6 border-t border-[#0FF4C6]/50">
        <div className="space-y-4">
            <p className="text-sm font-bold text-white">5. Video Controls (Optional)</p>
            <FileInput label="Start Image" file={startImageFile} setFile={setStartImageFile} disabled={isLoading} />
            <FileInput label="End Image" file={endImageFile} setFile={setEndImageFile} disabled={isLoading} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onGenerateImage}
            disabled={isLoading || !prompt}
            className="bg-[#0da594] text-white font-bold py-2 px-4 hover:bg-[#0b8f7e] transition-colors disabled:bg-[#333333] disabled:cursor-not-allowed"
          >
            Generate Image
          </button>
          <button
            onClick={onGenerateVideo}
            disabled={isLoading || !prompt}
            className="bg-indigo-600 text-white font-bold py-2 px-4 hover:bg-indigo-700 transition-colors disabled:bg-[#333333] disabled:cursor-not-allowed"
          >
            Generate Video
          </button>
        </div>
      </div>
    </div>
  );
};
