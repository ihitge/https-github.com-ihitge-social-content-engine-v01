
import React from 'react';
import type { Platform, GenerationType } from '../types';
import { PLATFORMS } from '../constants';

interface ControlsPanelProps {
  generationType: GenerationType;
  setGenerationType: (type: GenerationType) => void;
  selectedPlatform: Platform;
  setSelectedPlatform: (platform: Platform) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onFileChange: (file: File | null, type: 'start' | 'end') => void;
  onGenerate: () => void;
  isLoading: boolean;
  startImageFile: File | null;
  endImageFile: File | null;
  apiKeyMessage: string | null;
}

const FileInput: React.FC<{ label: string; file: File | null; onChange: (file: File | null) => void; disabled: boolean }> = ({ label, file, onChange, disabled }) => {
    const id = `file-input-${label.toLowerCase().replace(' ', '-')}`;
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-400">{label}</label>
            <div className="mt-1 flex items-center justify-between p-2 rounded-md bg-gray-800 border border-gray-700">
                <span className="text-gray-300 text-sm truncate w-40">{file?.name || 'No file selected'}</span>
                <input
                    id={id}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                    disabled={disabled}
                />
                <label htmlFor={id} className={`cursor-pointer text-sm font-semibold ${disabled ? 'text-gray-500' : 'text-cyan-400 hover:text-cyan-300'}`}>
                    {file ? 'Change' : 'Upload'}
                </label>
            </div>
        </div>
    );
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  generationType, setGenerationType, selectedPlatform, setSelectedPlatform, prompt, setPrompt, onFileChange, onGenerate, isLoading, startImageFile, endImageFile, apiKeyMessage
}) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 space-y-6 h-full flex flex-col">
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-white">1. Content Type</h3>
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/50 rounded-md">
          <button onClick={() => setGenerationType('image')} className={`px-4 py-2 text-sm rounded ${generationType === 'image' ? 'bg-cyan-500 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}>Image</button>
          <button onClick={() => setGenerationType('video')} className={`px-4 py-2 text-sm rounded ${generationType === 'video' ? 'bg-cyan-500 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}>Video</button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-white">2. Platform</h3>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map(platform => (
            <button key={platform.id} onClick={() => setSelectedPlatform(platform)} className={`p-2 flex flex-col items-center justify-center rounded-md border-2 transition-all duration-200 ${selectedPlatform.id === platform.id ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}>
              <platform.icon className="w-6 h-6 mb-1" />
              <span className="text-xs text-center text-gray-300">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-white">3. Creative Prompt</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A robot holding a red skateboard in a futuristic city"
          className="w-full flex-grow p-3 bg-gray-900/50 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          rows={5}
        />
      </div>

      {generationType === 'video' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-white">4. Video Assets (Optional)</h3>
          <FileInput label="Start Image" file={startImageFile} onChange={(file) => onFileChange(file, 'start')} disabled={isLoading} />
          <FileInput label="End Image" file={endImageFile} onChange={(file) => onFileChange(file, 'end')} disabled={isLoading} />
        </div>
      )}

      <div className="pt-4 border-t border-gray-700/50">
        <button
          onClick={onGenerate}
          disabled={isLoading || !prompt}
          className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
        {apiKeyMessage && (
            <p className="text-sm text-green-400 text-center mt-2">{apiKeyMessage}</p>
        )}
      </div>
    </div>
  );
};
