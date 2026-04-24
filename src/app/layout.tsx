
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import GTagEvents from '@/components/layout/GTagEvents';
import { GA_TRACKING_ID } from '@/lib/gtag';

export const metadata: Metadata = {
  title: 'BagOfWords',
  description: 'Your Guide to Understanding and Applying AI, ML, and NLP.',
  icons: {
    icon: '/BagOfWords.svg',
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark scroll-smooth`}>
    <head>
      <link rel="icon" type="image/svg+xml" href="/BagOfWords.svg" />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6964891412733844"
        crossOrigin="anonymous"
      ></script>
    </head>
      <body className={`antialiased flex flex-col min-h-screen`}>
        {/* Google Analytics Scripts */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <Header />
        <main className="flex-grow container mx-auto px-4 lg:px-16 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
        <GTagEvents /> {/* Component to handle route changes for GA */}
        {/* Simple Analytics Script - Added back */}
        <Script async src="https://scripts.simpleanalyticscdn.com/latest.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
