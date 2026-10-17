/** @type {import('next').NextConfig} */

// GitHub Pages builds are fully static (no Node server): we flip to a static
// export and prefix everything with the repo's project-pages base path. This is
// only active when the deploy workflow sets GITHUB_PAGES=TRUE, so `npm run dev`
// and the regular CI `next build` (server mode) are unaffected.
const isPages = process.env.GITHUB_PAGES === 'TRUE'
const basePath = isPages ? (process.env.SITE_BASE || '/kombai-gallery') : ''

const nextConfig = {
  reactStrictMode: true,
  ...(isPages
    ? {
        output: 'export',
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
          ],
        },
      }),
}

export default nextConfig
