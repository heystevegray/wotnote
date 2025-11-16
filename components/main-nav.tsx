import Link from 'next/link';

import { siteConfig } from '@/lib/config';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';

import { buttonVariants } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger aria-label="Open Sidebar" />
        <Link href="/" className="flex items-center space-x-2">
          {/* <Icons.logo className="size-6" /> */}
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
      </div>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item) =>
              item.href && (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80',
                  )}>
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      item.isAI && buttonVariants({ variant: 'ai' }),
                    )}>
                    <item.icon className="size-4" />
                    {item.title}
                  </div>
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
