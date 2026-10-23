import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'assets.bagofwords.tech',
            },
            {
                protocol: 'https',
                hostname: '*.r2.dev',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    outputFileTracingIncludes: {
        '/*': ['./src/content/articles/**/*'],
        '/articles': ['./src/content/articles/**/*'],
        '/articles/[slug]': ['./src/content/articles/**/*']
    }
};

export default nextConfig;
