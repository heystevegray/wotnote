import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

const Container = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return (
    <div className={cn('mx-auto w-full p-2 md:p-4 lg:max-w-6xl', className)}>
      {children}
    </div>
  );
};

export default Container;
