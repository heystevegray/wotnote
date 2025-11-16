import Link from 'next/link';

import { MY_NAME, MY_WEBSITE_URL } from '@/lib/config';

const Footer = () => {
  return (
    <footer className="flex items-center justify-center gap-1 py-8 text-xs">
      <span className="text-muted-foreground">Created by</span>
      <Link target="_blank" href={MY_WEBSITE_URL} className="underline">
        {MY_NAME}
      </Link>
    </footer>
  );
};

export default Footer;
