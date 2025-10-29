
import React, { useRef, useEffect } from 'react';
import type { Suggestion } from '../types';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  onUpdateSuggestion: (index: number, field: keyof Suggestion, value: string) => void;
  isLoading: boolean;
}

const EditableField: React.FC<{
    label: string;
    value: string;
    onUpdate: (value: string) => void;
    rows?: number;
}> = ({ label, value, onUpdate, rows = 1 }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onUpdate(e.target.value)}
                rows={rows}
                className="w-full bg-gray-900/50 text-gray-200 resize-none border border-gray-700 p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                aria-label={`Edit ${label}`}
            />
        </div>
    );
};


const SuggestionCard: React.FC<{ 
    suggestion: Suggestion; 
    index: number;
    onUpdate: (index: number, field: keyof Suggestion, value: string) => void;
}> = ({ suggestion, index, onUpdate }) => (
    <div className="bg-gray-800 p-4 border border-gray-700 flex flex-col justify-between space-y-3">
        <EditableField 
            label="HOOK" 
            value={suggestion.hook} 
            onUpdate={(value) => onUpdate(index, 'hook', value)} 
        />
        <EditableField 
            label="KEY MESSAGES" 
            value={suggestion.keyMessages} 
            onUpdate={(value) => onUpdate(index, 'keyMessages', value)}
            rows={2}
        />
        <EditableField 
            label="CTA" 
            value={suggestion.cta} 
            onUpdate={(value) => onUpdate(index, 'cta', value)} 
        />
    </div>
);


export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ suggestions, onUpdateSuggestion, isLoading }) => {
  return (
    <div className="space-y-4 flex flex-col">
      <div>
        <h3 className="font-bold text-lg text-white">Creative Suggestions</h3>
      </div>

      {suggestions.length === 0 && !isLoading && (
        <div className="flex-grow flex items-center justify-center text-center text-gray-500 min-h-[100px]">
          <div>
            <p>Click "Generate Test Ideas" in the</p>
            <p>control panel to get started.</p>
          </div>
        </div>
      )}

      {isLoading && suggestions.length === 0 && (
         <div className="flex-grow flex items-center justify-center text-center text-gray-400 min-h-[100px]">
           <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
         </div>
      )}

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              index={i}
              suggestion={s}
              onUpdate={onUpdateSuggestion}
            />
          ))}
        </div>
      )}
    </div>
  );
};