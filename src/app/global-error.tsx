'use client';

import NextError from 'next/error';

/**
 * Root error boundary component catching unhandled root layout errors.
 * Passes statusCode 0 to NextError for generic error rendering in App Router.
 */
export default function GlobalError({
  error: _error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

