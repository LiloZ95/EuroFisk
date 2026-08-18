import type { Field, TextField, TextareaField, UploadField } from "payload";

/**
 * The site ships in Swedish, English and Arabic. Payload's built-in localization stores
 * one row per locale, which means the owner edits each language behind a locale switcher
 * in the top bar — that is exactly the behaviour we want, so text fields here are simply
 * marked `localized: true` rather than hand-rolling sv/en/ar sub-fields.
 */

interface TextOpts {
  name: string;
  label?: string;
  required?: boolean;
  // Typed against the specific field rather than the `Field` union: the union's `admin`
  // resolves to the first member's shape and will not accept a text field's options.
  admin?: TextField["admin"];
}

interface AreaOpts extends Omit<TextOpts, "admin"> {
  admin?: TextareaField["admin"];
}

/** A single-line, per-language string. */
export const locText = ({ name, label, required, admin }: TextOpts): Field => ({
  name,
  type: "text",
  label,
  required,
  localized: true,
  admin,
});

/** A multi-line, per-language string. */
export const locArea = ({ name, label, required, admin }: AreaOpts): Field => ({
  name,
  type: "textarea",
  label,
  required,
  localized: true,
  admin,
});

/**
 * An image slot. Stored as a relation to the Media collection, so the same photo can be
 * reused in several places without re-uploading, and swapping it updates every use.
 */
export const image = (
  name: string,
  label: string,
  description?: string,
  required = false,
): UploadField => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
  required,
  ...(description ? { admin: { description } } : {}),
});
