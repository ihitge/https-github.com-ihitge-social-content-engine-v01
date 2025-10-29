
import { GoogleGenAI } from "@google/genai";

interface VideoGenerationParams {
  prompt: string;
  startImage: string | null;
  endImage: string | null;
  // Fix: Update aspect ratio type to match supported values.
  aspectRatio: "1:1" | "3:4" | "9:16" | "16:9";
  resolution: "720p" | "1080p";
  onProgress: (message: string) => void;
}

const getAIClient = () => {
    // Re-instantiate to ensure the latest API key from the selection dialog is used.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

// Fix: Update aspect ratio type to match supported values.
export const generateImage = async (prompt: string, aspectRatio: "1:1" | "3:4" | "9:16" | "16:9"): Promise<string> => {
    const ai = getAIClient();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed to produce an image.");
    }
};

export const generateVideo = async ({ prompt, startImage, endImage, aspectRatio, resolution, onProgress }: VideoGenerationParams): Promise<string> => {
    const ai = getAIClient();
    
    // Fix: The VEO model only supports 16:9 and 9:16. Map other aspect ratios
    // to a supported value to prevent API errors. Defaulting to 9:16 for portrait.
    const videoAspectRatio = (aspectRatio === '16:9' || aspectRatio === '9:16') ? aspectRatio : '9:16';

    const requestPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution,
            aspectRatio: videoAspectRatio,
        }
    };

    if (startImage) {
        requestPayload.image = {
            imageBytes: startImage,
            mimeType: 'image/png'
        };
    }

    if (endImage) {
        requestPayload.config.lastFrame = {
             imageBytes: endImage,
             mimeType: 'image/png'
        };
    }

    let operation = await ai.models.generateVideos(requestPayload);

    onProgress('Video generation started. This can take a few minutes...');
    let pollCount = 0;
    while (!operation.done) {
        pollCount++;
        onProgress(`Polling for video status... (Attempt ${pollCount})`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    onProgress('Video processing complete!');

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (downloadLink) {
        return downloadLink;
    } else {
        throw new Error("Video generation failed. No download link was provided.");
    }
};
