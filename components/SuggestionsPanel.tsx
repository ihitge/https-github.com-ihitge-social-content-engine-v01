
import React from 'react';
import type { Platform, GenerationResult } from '../types';
import { PLATFORMS } from '../constants';

interface SuggestionsPanelProps {
  currentResult: GenerationResult | null;
  onGenerateVariant: (platform: Platform) => void;
  isLoading: boolean;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ currentResult, onGenerateVariant, isLoading }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 h-full">
      <h3 className="font-bold text-lg text-white mb-4">Streamline Your Workflow</h3>
      {currentResult ? (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            Happy with your result? Generate it for other platforms with one click.
          </p>
          <div className="space-y-2">
            {PLATFORMS.filter(p => p.id !== currentResult.platform.id).map(platform => (
              <button
                key={platform.id}
                onClick={() => onGenerateVariant(platform)}
                disabled={isLoading}
                className="w-full flex items-center p-3 bg-gray-900/50 rounded-md border border-gray-700 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <platform.icon className="w-5 h-5 mr-3 text-gray-300" />
                <span className="text-sm font-medium text-gray-200">Generate for {platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Generate your first piece of content to unlock campaign suggestions.
        </p>
      )}
    </div>
  );
};
