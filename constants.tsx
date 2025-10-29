
import React from 'react';
import type { Platform } from './types';
import { TikTokIcon, YouTubeShortsIcon, InstagramStoryIcon, InstagramPostIcon, FacebookPostIcon, GoogleAdIcon } from './components/icons/PlatformIcons';

export const PLATFORMS: Platform[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: TikTokIcon,
    aspectRatio: '9:16',
    resolution: '1080p',
  },
  {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    icon: YouTubeShortsIcon,
    aspectRatio: '9:16',
    resolution: '1080p',
  },
  {
    id: 'instagram_story',
    name: 'Instagram Story',
    icon: InstagramStoryIcon,
    aspectRatio: '9:16',
    resolution: '1080p',
  },
  {
    id: 'instagram_post',
    name: 'Instagram Post',
    icon: InstagramPostIcon,
    aspectRatio: '1:1',
    resolution: '1080p',
  },
  {
    id: 'facebook_post',
    name: 'Facebook Post',
    icon: FacebookPostIcon,
    // Fix: Changed aspect ratio from '4:5' to '3:4' to use a supported value for image generation.
    aspectRatio: '3:4',
    resolution: '1080p',
  },
    {
    id: 'google_ad_landscape',
    name: 'Google Ad (Landscape)',
    icon: GoogleAdIcon,
    aspectRatio: '16:9',
    resolution: '720p',
  },
];
