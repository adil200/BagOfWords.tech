// src/components/layout/GTagEvents.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as gtag from '@/lib/gtag';

export default function GTagEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (gtag.GA_TRACKING_ID) {
      gtag.pageview(pathname);
    }
  }, [pathname]);

  // This component doesn't render anything itself, it just handles events
  return null;
}
