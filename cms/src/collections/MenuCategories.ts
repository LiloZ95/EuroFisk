import type { CollectionConfig } from "payload";
import { image, locText, locArea } from "../fields/localized";
import { rebuildAfterChange, rebuildAfterDelete } from "../hooks/triggerRebuild";

/**
 * A menu section ("Grilled / Fried", "Fish by the kilo") with its dishes nested inside.
 *
 * Dishes live as an array on the category rather than as their own collection: the owner
 * thinks in terms of "the grilled section", and nesting means reordering dishes is a drag
 * instead of editing a sort field on twelve separate records.
 */
export const MenuCategories: CollectionConfig = {
  slug: "menu-categories",
  labels: { singular: "Menu section", plural: "Menu sections" },
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
    useAsTitle: "label",
    description: "The sections of the menu, and the dishes in each.",
    group: "Content",
    defaultColumns: ["label", "menuType", "order", "updatedAt"],
  },
  defaultSort: "order",
  fields: [
    locText({ name: "label", label: "Section name", required: true, admin: { description: 'e.g. "Grilled / Fried".' } }),
    {
      name: "menuType",
      type: "select",
      required: true,
      options: [
        { label: "Portion menu (grill restaurant)", value: "portion" },
        { label: "Per-kilo menu (fish counter)", value: "kg" },
      ],
      admin: { description: "Which shop's menu this section belongs to." },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: { description: "Lower numbers appear first on the menu page." },
    },
    locArea({ name: "note", label: "Note under the section name", admin: { description: "Optional. Explains what is included." } }),
    locText({
      name: "priceUnit",
      label: "Price unit",
      admin: { description: 'Optional. Added after the price in orders, e.g. "per kg".' },
    }),
    {
      name: "items",
      type: "array",
      label: "Dishes",
      admin: { description: "Drag to reorder. The order here is the order on the website." },
      fields: [
        locText({ name: "name", label: "Dish name", required: true }),
        {
          name: "arabicName",
          type: "text",
          label: "Arabic name (second line)",
          admin: {
            description:
              "Shown as a smaller second line under the name on the Swedish and English menus. Leave empty to hide.",
          },
        },
        locArea({ name: "desc", label: "Description" }),
        {
          name: "priceMode",
          type: "radio",
          defaultValue: "single",
          options: [
            { label: "One price", value: "single" },
            { label: "Several prices (e.g. raw / grilled)", value: "options" },
          ],
          admin: { description: "Most dishes have one price. Use several for per-kilo fish sold raw or prepared." },
        },
        {
          name: "price",
          type: "text",
          admin: {
            description: 'Include the currency, e.g. "149 kr".',
            condition: (_, siblingData) => siblingData?.priceMode !== "options",
          },
        },
        {
          name: "priceOptions",
          type: "array",
          label: "Prices",
          admin: {
            description: "One row per variant.",
            condition: (_, siblingData) => siblingData?.priceMode === "options",
          },
          fields: [
            locText({ name: "label", label: "Variant", required: true, admin: { description: 'e.g. "Raw" or "Grilled".' } }),
            { name: "price", type: "text", required: true, admin: { description: 'e.g. "199 kr".' } },
          ],
        },
        locText({ name: "tag", label: "Small badge", admin: { description: 'Optional, e.g. "Popular".' } }),
        image("photo", "Photo", "Optional. Dishes without a photo show a placeholder."),
        {
          name: "orderable",
          type: "checkbox",
          defaultValue: true,
          label: "Customers can order this",
          admin: { description: "Uncheck to show the dish without an order button." },
        },
      ],
    },
  ],
};
