import type { MetadataRoute } from 'next'

/** The CMS is an admin/API origin. Only www.eurofisk.se should appear in search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
