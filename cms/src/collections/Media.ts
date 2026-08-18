import type { CollectionConfig } from "payload";

/**
 * Every photo and video on the site. Files go to Cloudflare R2 (configured in
 * payload.config.ts); Payload stores only the metadata row plus the generated sizes.
 *
 * `alt` is localized because it is read aloud by screen readers and must match the
 * language the visitor is browsing in.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo", plural: "Photos" },
  access: {
    // The public site reads images straight from R2, but the API listing stays open so a
    // build can enumerate media. Writes require a logged-in user.
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    description:
      "All photos used on the website. Upload once here, then pick the photo in the Home page or Menu sections.",
    defaultColumns: ["filename", "alt", "updatedAt"],
    group: "Media",
  },
  upload: {
    // Generated at upload time so the site never ships a 5 MB phone photo. The site picks
    // the size it needs; `card` matches the featured/gallery tiles, `hero` the full-bleed
    // background.
    imageSizes: [
      { name: "thumb", width: 400, height: 300, position: "centre" },
      { name: "card", width: 1000, withoutEnlargement: true },
      { name: "hero", width: 2000, withoutEnlargement: true },
    ],
    // WebP everywhere: roughly half the bytes of JPEG at the same visual quality, and every
    // browser the site supports handles it.
    formatOptions: {
      format: "webp",
      options: { quality: 82 },
    },
    // Payload sniffs the file's actual contents rather than trusting the extension. Some
    // MP4s (including the hero video) declare an `M4V ` brand and are detected as
    // video/x-m4v or video/quicktime, though browsers play them as ordinary MP4.
    mimeTypes: ["image/*", "video/mp4", "video/x-m4v", "video/quicktime"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: {
        description:
          "Short description of what is in the photo, for visually impaired visitors and Google. Example: \"Grilled sea bass with salad\".",
      },
    },
  ],
};
