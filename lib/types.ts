import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon: LucideIcon;
  isAI?: boolean;
}

export type ClassName = { className?: string };
