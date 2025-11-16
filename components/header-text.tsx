import type { PropsWithChildren } from 'react';

import type { ClassName } from '@/lib/types';
import { cn } from '@/lib/utils';

import Container from './container';
import { Icons } from './icons';
import { Badge } from './ui/badge';

export type EmptyScreenProps = {
  title?: string;
  description?: string;
  hideLogo?: boolean;
  badge?: string;
} & ClassName &
  PropsWithChildren;

const HeaderText = ({
  title,
  description,
  children = null,
  hideLogo = false,
  badge = '',
  className,
}: EmptyScreenProps) => {
  return (
    <div className="pt-12">
      <Container
        className={cn('flex w-full items-center justify-center', className)}>
        <div className="flex flex-col space-y-4 text-center">
          <div
            className={cn('flex w-full justify-center', {
              hidden: hideLogo,
            })}>
            <Icons.logo className="size-6" />
          </div>
          <Badge
            className={cn('mx-auto w-fit', {
              hidden: !badge,
            })}>
            {badge}
          </Badge>
          <h2 className="m-0 flex flex-col items-center justify-center bg-clip-text p-0 text-2xl md:text-3xl">
            {title ?? null}
          </h2>
          {description ? (
            <p className="text-lg leading-normal text-muted-foreground">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </div>
  );
};

export default HeaderText;
