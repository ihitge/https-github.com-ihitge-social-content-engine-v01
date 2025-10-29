
import React from 'react';
import type { GeneratedContent, Platform } from '../types';

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

interface PreviewProps {
  generatedContent: GeneratedContent[];
  isLoading: boolean;
  platform: Platform;
}

const EmptyState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <div className="w-16 h-16 mb-4 border-2 border-dashed border-gray-600"></div>
        <h3 className="text-lg font-semibold text-gray-400">Your Content Will Appear Here</h3>
        <p className="text-sm">Use the controls on the left to generate an image or video.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-lg font-semibold text-gray-300">Generating Creative...</h3>
        <p className="text-sm">This may take a moment, especially for videos.</p>
        <p className="text-xs mt-2">Hang tight, the AI is working its magic!</p>
    </div>
);

const ContentCard: React.FC<{ content: GeneratedContent }> = ({ content }) => {
    const downloadFile = () => {
        const link = document.createElement('a');
        link.href = content.url;
        const fileExtension = content.type === 'video' ? 'mp4' : 'jpg';
        link.download = `${content.platform.name.toLowerCase().replace(' ', '_')}_${content.id.substring(0, 6)}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="group relative overflow-hidden bg-gray-800 border border-gray-700">
            {content.type === 'image' ? (
                <img src={content.url} alt={content.prompt} className="w-full h-full object-cover" />
            ) : (
                <video src={content.url} controls autoPlay loop muted className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div>
                    <h4 className="font-bold text-sm">{content.hook}</h4>
                    <p className="text-xs mt-1">{content.keyMessages.replace(/\\n/g, '\n')}</p>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold bg-cyan-500/80 px-2 py-1">{content.cta}</span>
                    <button onClick={downloadFile} className="p-2 bg-white/20 hover:bg-white/40 transition-colors">
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Preview: React.FC<PreviewProps> = ({ generatedContent, isLoading, platform }) => {
    const getGridCols = () => {
        if (platform.aspectRatio === '16:9') return 'grid-cols-1';
        if (platform.aspectRatio === '1:1' || platform.aspectRatio === '4:3' || platform.aspectRatio === '3:4') return 'grid-cols-2';
        return 'grid-cols-3'; // for 9:16
    }

    return (
        <div className="bg-gray-900 p-4 h-full overflow-y-auto">
            {isLoading ? (
                <LoadingState />
            ) : generatedContent.length === 0 ? (
                <EmptyState />
            ) : (
                <div className={`grid ${getGridCols()} gap-4`}>
                    {generatedContent.map(content => <ContentCard key={content.id} content={content} />)}
                </div>
            )}
        </div>
    );
};