'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as gtag from '@/lib/gtag';

/**
 * Client listener tracking pageview route transitions in Google Analytics.
 */
export default function GTagEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (gtag.GA_TRACKING_ID) {
      gtag.pageview(pathname);
    }
  }, [pathname]);

  return null;
}

