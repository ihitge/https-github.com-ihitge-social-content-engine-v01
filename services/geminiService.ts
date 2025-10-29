
import { GoogleGenAI, Type } from '@google/genai';
import type { Platform, Suggestion } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, platform: Platform): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API key not found. Please provide an API key.');
  }
  const ai = getAI();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: platform.aspectRatio,
    },
  });

  const base64ImageBytes = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateVideo = async (
  prompt: string,
  platform: Platform,
  startImageFile: File | null,
  endImageFile: File | null
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API key not found. Please select an API key.');
  }
  const ai = getAI();

  // Fix: Ensure aspect ratio is compatible with the Veo model ('16:9' or '9:16').
  let videoAspectRatio: Platform['aspectRatio'] = platform.aspectRatio;
  if (videoAspectRatio !== '16:9' && videoAspectRatio !== '9:16') {
    const [w, h] = videoAspectRatio.split(':').map(Number);
    videoAspectRatio = w > h ? '16:9' : '9:16';
  }

  const config: any = {
      numberOfVideos: 1,
      resolution: platform.resolution,
      aspectRatio: videoAspectRatio,
  };

  let image;
  if (startImageFile) {
    const base64Data = await fileToBase64(startImageFile);
    image = {
        imageBytes: base64Data,
        mimeType: startImageFile.type,
    };
  }
  
  if (endImageFile) {
      const base64Data = await fileToBase64(endImageFile);
      config.lastFrame = {
        imageBytes: base64Data,
        mimeType: endImageFile.type,
      };
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image,
    config,
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error('Video generation result not found.');
  }
  
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
};

export const generateSuggestions = async (prompt: string, platform: Platform): Promise<Suggestion[]> => {
    if (!process.env.API_KEY) {
      throw new Error('API key not found. Please provide an API key.');
    }
    const ai = getAI();
    const model = 'gemini-2.5-flash';

    const fullPrompt = `
      You are an expert social media marketing assistant.
      Based on the user's visual prompt and selected platform, generate 3 distinct and creative concepts for an ad.
      Each concept should include a short, catchy "Hook" (headline), "Key Messages" (body text, use \\n for new lines), and a "Call to Action" (CTA).
      The concepts should be tailored to the tone and style of the specified platform.
      
      Visual Prompt: "${prompt}"
      Platform: "${platform.name}"
    `;

    // Fix: Using responseSchema for more reliable JSON output.
    const suggestionSchema = {
        type: Type.OBJECT,
        properties: {
            hook: { type: Type.STRING, description: 'A short, catchy headline for the ad.' },
            keyMessages: { type: Type.STRING, description: 'The body text of the ad. Use \\n for new lines.' },
            cta: { type: Type.STRING, description: 'The call to action for the ad.' },
        },
        required: ['hook', 'keyMessages', 'cta'],
    };

    const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: suggestionSchema,
                description: 'A list of 3 creative ad concepts.'
            }
        }
    });

    try {
        const text = response.text.trim();
        // With responseSchema, the output should be a clean JSON string.
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse suggestions JSON:", e);
        console.error("Raw response text:", response.text);
        throw new Error("Failed to generate valid suggestions. Please try again.");
    }
};
