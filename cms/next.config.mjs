import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app serves the admin panel and API only; the public site is the separate Vite build.
  //
  // `standalone` bundles a self-contained server for Docker or a VM. Vercel builds its own
  // output and treats this as unsupported, so it is only applied off-Vercel — which keeps
  // the self-hosted path working if we ever move off it.
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  // The Vite site one level up has its own lockfile. Without this, Next picks that one and
  // then reads the site's postcss/tailwind config, which it cannot parse.
  outputFileTracingRoot: import.meta.dirname,
  // The Vercel project is the private editing/API surface, not a public website. Keep its
  // admin and API URLs out of every search index even if a crawler discovers the hostname.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
