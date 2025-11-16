import { Blocks, Sparkle } from 'lucide-react';

import { Icons } from '@/components/icons';
import type { DefaultConfig } from './core/piano';

export const MY_WEBSITE_URL = 'https://www.stevegray.io/';
export const MY_NAME = 'Steve Gray';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'wotnote',
  description: 'Write music faster',
  mainNav: [
    {
      icon: Icons.logo,
      title: 'Home',
      href: '/',
      hideMain: true,
    },
    {
      icon: Blocks,
      title: 'Build',
      href: '/build',
    },
    {
      icon: Sparkle,
      title: 'Generate',
      href: '/chat',
      isAI: true,
    },
  ],
  links: {
    github: 'https://github.com/heystevegray/wotnote',
  },
};

export type URLParams = Record<keyof DefaultConfig, string> & { query: string };

export const urlParams: URLParams = {
  key: 'key',
  scale: 'scale',
  color: 'color',
  query: 'q',
  build: 'build',
  accidental: 'sharp',
};
