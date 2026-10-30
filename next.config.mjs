import { readFileSync } from "node:fs";
// next.config.mjs
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });
const publicMedia = JSON.parse(readFileSync(new URL("./data/public-cloudinary-manifest.json", import.meta.url), "utf8"));
const mediaMigrationState = JSON.parse(readFileSync(new URL("./data/public-cloudinary-state.json", import.meta.url), "utf8"));

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
    async redirects() {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (mediaMigrationState.active && !cloudName) throw new Error("Cloudinary cloud name missing for media redirects");
        const cloudinaryRedirects = mediaMigrationState.active ? publicMedia.assets.map(({path,publicId}) => ({
            source: path,
            destination: "https://res.cloudinary.com/" + cloudName + "/image/upload/f_auto,q_auto:best/" + publicId,
            permanent: true,
        })) : [];
        return [
            {
                source: '/blog/posadzki-zywiczne-sokolow-glogów-rzeszow-okolice',
                destination: '/blog/posadzki-zywiczne-sokolow-glogow-rzeszow-okolice',
                permanent: true,
            },
            ...cloudinaryRedirects,
        ];
    },
    // Compress all responses
    compress: true,
    // Configure external image domains
    images: {
        loader: 'custom',
        loaderFile: './lib/cloudinary-loader.ts',
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
