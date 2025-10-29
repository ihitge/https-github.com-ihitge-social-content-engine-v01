// Fix: Import React to resolve namespace error.
import React from 'react';

export interface Platform {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  // Fix: Use supported aspect ratios. Changed '4:5' to '3:4' and removed '1.91:1'.
  aspectRatio: "1:1" | "3:4" | "9:16" | "16:9";
  resolution: "720p" | "1080p";
}

export type GenerationType = 'image' | 'video';

export interface GenerationResult {
    type: GenerationType;
    url: string;
    platform: Platform;
    prompt: string;
    hook?: string;
    keyMessages?: string;
    cta?: string;
}
