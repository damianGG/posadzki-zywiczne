// next.config.mjs
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'],
    experimental: { 
        mdxRs: true,
        serverComponentsExternalPackages: ['nodemailer'],
    },
    // Optimize for production builds
    reactStrictMode: true,
    // Ensure proper caching headers
    poweredByHeader: false,
    // Compress all responses
    compress: true,
    // Configure external image domains
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
    },
};

export default withMDX(nextConfig);
