import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app serves the admin panel and API only; the public site is the separate Vite build.
  output: 'standalone',
  // The Vite site one level up has its own lockfile. Without this, Next picks that one and
  // then reads the site's postcss/tailwind config, which it cannot parse.
  outputFileTracingRoot: import.meta.dirname,
}

export default withPayload(nextConfig)
