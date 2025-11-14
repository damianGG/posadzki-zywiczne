// next.config.mjs
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'],
    experimental: { 
        mdxRs: true,
    },
    // Optimize for production builds
    reactStrictMode: true,
    // Ensure proper caching headers
    poweredByHeader: false,
    // Compress all responses
    compress: true,
};

export default withMDX(nextConfig);
