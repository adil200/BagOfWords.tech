import { Loader2 } from 'lucide-react';

/**
 * Global fallback loading spinner for Next.js Suspense boundaries.
 */
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
  );
}

