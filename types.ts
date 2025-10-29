import React from 'react';

export interface Platform {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  aspectRatio: '9:16' | '1:1' | '3:4' | '4:3' | '16:9';
  resolution: '1080p' | '720p';
}

export interface Suggestion {
  hook: string;
  keyMessages: string;
  cta: string;
}

export interface GeneratedContent extends Suggestion {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  platform: Platform;
}
