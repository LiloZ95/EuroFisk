import type { CollectionConfig } from "payload";
import { image, locText, locArea } from "../fields/localized";
import { rebuildAfterChange, rebuildAfterDelete } from "../hooks/triggerRebuild";

/**
 * One row per shop. Holds everything that differs between the two locations: contact
 * details, opening hours, the photos, and the marketing copy that describes that shop's
 * offer (Rosengård grills; Östra Sorgenfri sells fresh fish by the kilo).
 *
 * `slug` and `menuType` drive site behaviour, so they are admin-visible but explained —
 * changing `slug` changes the shop's URL and breaks existing links.
 */
export const Branches: CollectionConfig = {
  slug: "branches",
  labels: { singular: "Location", plural: "Locations" },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  // Every save here changes what the public site shows, so it needs a rebuild.
  hooks: {
    afterChange: [rebuildAfterChange],
    afterDelete: [rebuildAfterDelete],
  },
  admin: {
    useAsTitle: "name",
    description: "The two EuroFisk shops — address, hours, photos and page text.",
    group: "Content",
    defaultColumns: ["name", "area", "menuType", "updatedAt"],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── Details ───────────────────────────────────────────────────────────
        {
          label: "Details",
          description: "Address, phone and opening hours shown across the site.",
          fields: [
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description:
                  "The shop's web address, e.g. \"rosengard\" gives eurofisk.se/rosengard. Changing this breaks existing links — avoid unless you mean it.",
              },
            },
            { name: "name", type: "text", required: true, admin: { description: 'Full name, e.g. "EuroFisk (Rosengård)".' } },
            { name: "area", type: "text", required: true, admin: { description: 'Short area name shown in the location picker, e.g. "Rosengård".' } },
            { name: "address", type: "text", required: true },
            { name: "mapsUrl", type: "text", label: "Google Maps link", admin: { description: 'Used by the "Directions" button.' } },
            {
              name: "phoneDisplay",
              type: "text",
              label: "Phone (as shown)",
              admin: { description: 'How the number appears on screen, e.g. "+46 79 016 48 13".' },
            },
            {
              name: "phoneHref",
              type: "text",
              label: "Phone (dial link)",
              admin: { description: 'The number the call button dials, e.g. "tel:+46790164813".' },
            },
            {
              name: "whatsappNumber",
              type: "text",
              admin: { description: 'Digits only, no + or spaces, e.g. "46790164813". Orders are sent here.' },
            },
            {
              name: "menuType",
              type: "select",
              required: true,
              options: [
                { label: "Portion menu (grill restaurant)", value: "portion" },
                { label: "Per-kilo menu (fish counter)", value: "kg" },
              ],
              admin: { description: "Decides which menu this shop shows." },
            },
            {
              name: "serviceHours",
              type: "group",
              label: "Ordering window",
              admin: { description: "Earliest and latest time a customer can pick for pickup or arrival." },
              fields: [
                { name: "opens", type: "text", required: true, admin: { description: '24-hour, e.g. "10:00".' } },
                { name: "closes", type: "text", required: true, admin: { description: '24-hour, e.g. "20:00".' } },
              ],
            },
            locText({
              name: "hoursSummary",
              label: "Opening hours (one-line summary)",
              admin: { description: 'Shown in the header and footer, e.g. "Mån–tis 10–19 · Ons–sön 10–20".' },
            }),
            {
              name: "hoursRows",
              type: "array",
              label: "Opening hours (full table)",
              admin: { description: "One row per group of days, shown on the contact section." },
              fields: [
                locText({ name: "days", label: "Days", required: true }),
                { name: "time", type: "text", required: true, admin: { description: 'e.g. "10:00–20:00".' } },
              ],
            },
          ],
        },

        // ── Photos ────────────────────────────────────────────────────────────
        {
          label: "Photos",
          description: "The pictures shown on this shop's pages. Click a box to pick or upload.",
          fields: [
            image("heroImage", "Top background photo", "The big photo behind the headline at the top of the home page. Put the important part in the middle — edges get cropped on phones.", true),
            {
              name: "heroVideo",
              type: "upload",
              relationTo: "media",
              label: "Top background video (optional)",
              admin: {
                description:
                  "A short looping video shown instead of the photo at the top. Leave empty to use the photo. Only add footage that actually shows this shop.",
              },
            },
            image("exteriorImage", "Outside of the shop", "Shown in the location/contact area.", true),
            image("interiorImage", "Inside of the shop", "Shown in the 'our place' section.", true),
            image("menuPlatterImage", "Menu header photo", "Small photo shown on menu section headers."),
            {
              name: "gallery",
              type: "array",
              label: "Photo gallery",
              minRows: 0,
              admin: {
                description:
                  "The photo strip on the home page, shown left to right. Drag rows to reorder, or use the arrows to add and remove.",
              },
              fields: [
                image("photo", "Photo", undefined, true),
                locText({
                  name: "caption",
                  label: "Caption (optional)",
                  admin: { description: "Shown when hovering. Leave empty to use the photo's own description." },
                }),
              ],
            },
          ],
        },

        // ── Home page text ────────────────────────────────────────────────────
        {
          label: "Home page text",
          description:
            "The words on this shop's home page. Use the language switcher at the top right to edit Swedish, English and Arabic.",
          fields: [
            {
              name: "hero",
              type: "group",
              label: "Top of the page",
              fields: [
                locText({ name: "badge", label: "Small label above the headline", admin: { description: 'e.g. "Fresh fish every day".' } }),
                locText({ name: "title1", label: "Headline — line 1" }),
                locText({ name: "title2", label: "Headline — line 2", admin: { description: "Shown in the highlight colour." } }),
                locText({ name: "title3", label: "Headline — line 3", admin: { description: "Keep short — long lines wrap awkwardly on wide screens." } }),
                locArea({ name: "sub", label: "Paragraph under the headline" }),
                locText({ name: "menuCta", label: "Menu button text" }),
                locText({ name: "bookCta", label: "Order button text" }),
              ],
            },
            {
              name: "featuredSection",
              type: "group",
              label: "Signature dishes section",
              fields: [
                locText({ name: "label", label: "Small label" }),
                locText({ name: "title", label: "Section heading" }),
                locArea({ name: "sub", label: "Section description" }),
                {
                  name: "cards",
                  type: "array",
                  label: "The dish cards",
                  maxRows: 3,
                  admin: { description: "The three highlighted dishes. Photo plus a short description each." },
                  fields: [
                    image("photo", "Photo", undefined, true),
                    locText({ name: "name", label: "Dish name", required: true }),
                    locText({ name: "tag", label: "Small line above the name" }),
                    locArea({ name: "desc", label: "Short description" }),
                  ],
                },
              ],
            },
            {
              name: "gallerySection",
              type: "group",
              label: "Gallery section",
              fields: [
                locText({ name: "label", label: "Small label" }),
                locText({ name: "title", label: "Section heading" }),
              ],
            },
            {
              name: "about",
              type: "group",
              label: "About section",
              admin: { description: "The brand story. Usually the same for both shops." },
              fields: [
                locText({ name: "label", label: "Small label" }),
                locText({ name: "title", label: "Heading", admin: { description: "Press Enter for a line break." } }),
                locArea({ name: "p1", label: "First paragraph" }),
                locArea({ name: "p2", label: "Second paragraph" }),
              ],
            },
            {
              name: "menuIntro",
              type: "group",
              label: "Menu page text",
              fields: [
                locArea({ name: "sub", label: "Text under the menu heading" }),
                locArea({ name: "note", label: "Note at the bottom of the menu", admin: { description: "Allergies, VAT, availability." } }),
                locText({ name: "dishesWord", label: 'Word for "dishes"', admin: { description: 'Used in counts, e.g. "12 dishes". On the fish counter this reads "kinds".' } }),
              ],
            },
            {
              name: "contact",
              type: "group",
              label: "Contact / ordering section",
              fields: [locArea({ name: "sub", label: "Text under the contact heading" })],
            },
          ],
        },
      ],
    },
  ],
};
