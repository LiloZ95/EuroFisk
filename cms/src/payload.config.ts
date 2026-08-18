import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";

import { Media } from "./collections/Media";
import { Branches } from "./collections/Branches";
import { MenuCategories } from "./collections/MenuCategories";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Fails loudly at boot rather than silently misbehaving at runtime. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — EuroFisk",
    },
  },

  // The site is written in Swedish first; English and Arabic are translations of it.
  // Arabic is flagged RTL so the admin panel mirrors its text inputs.
  localization: {
    locales: [
      { label: "Svenska", code: "sv" },
      { label: "English", code: "en" },
      { label: "العربية", code: "ar", rtl: true },
    ],
    defaultLocale: "sv",
    fallback: true,
  },

  collections: [Branches, MenuCategories, Media, Users],
  globals: [SiteSettings],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: required("DATABASE_URI") },
  }),

  // Uploads go to Cloudflare R2. R2 speaks the S3 API, so the S3 adapter works as-is —
  // the only R2-specific parts are the endpoint URL and forcing path-style addressing.
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Files are served from the public R2 URL (or a custom domain bound to the
          // bucket), not proxied through this server.
          generateFileURL: ({ filename, prefix }) =>
            [required("R2_PUBLIC_URL").replace(/\/$/, ""), prefix, filename]
              .filter(Boolean)
              .join("/"),
        },
      },
      bucket: required("R2_BUCKET"),
      config: {
        endpoint: required("R2_ENDPOINT"),
        region: "auto",
        forcePathStyle: true,
        credentials: {
          accessKeyId: required("R2_ACCESS_KEY_ID"),
          secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
        },
      },
    }),
  ],

  secret: required("PAYLOAD_SECRET"),

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // The Vite site fetches from this API at build time, and the browser never calls it, so
  // CORS only needs to allow the admin panel's own origin. Kept configurable for previews.
  cors: (process.env.CORS_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),

  sharp: (await import("sharp")).default,
});
