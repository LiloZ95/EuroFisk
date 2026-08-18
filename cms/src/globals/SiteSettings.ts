import type { GlobalConfig } from "payload";
import { image, locText, locArea } from "../fields/localized";

/**
 * Text that is the same on both shops: navigation, the order form, the delivery banner and
 * the WhatsApp message wording. A global rather than a collection because there is exactly
 * one of it — Payload renders it as a single edit screen with no list view.
 *
 * The form field labels live here too. They are rarely touched, so they sit in a collapsed
 * section to keep the common edits (nav, delivery banner) at the top.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site-wide text",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    description: "Wording shared by both shops — menu bar, buttons, order form and WhatsApp messages.",
    group: "Content",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Logo & navigation",
          fields: [
            image("logo", "Logo", "Shown in the top bar and the footer. A transparent PNG or WebP works best."),
            locText({ name: "navHome", label: "Home" }),
            locText({ name: "navMenu", label: "Menu" }),
            locText({ name: "navReviews", label: "Reviews" }),
            locText({ name: "navContact", label: "Contact" }),
            locText({ name: "navBook", label: "Order button" }),
          ],
        },
        {
          label: "Delivery banner",
          description: "The free home delivery strip on the home page.",
          fields: [
            locText({ name: "deliveryBadge", label: 'Badge, e.g. "New"' }),
            locText({ name: "deliveryTitle", label: "Headline" }),
            locText({ name: "deliveryArea", label: "Area covered" }),
            locArea({ name: "deliverySub", label: "Description" }),
            locText({ name: "deliveryCta", label: "Button text" }),
          ],
        },
        {
          label: "Order form",
          description: "Labels on the booking and ordering form. Rarely need changing.",
          fields: [
            locText({ name: "formName", label: '"Name" label' }),
            locText({ name: "formPhone", label: '"Phone" label' }),
            locText({ name: "formGuests", label: '"Guests" label' }),
            locText({ name: "formNote", label: '"Note" label' }),
            locText({ name: "formOrder", label: '"Your order" label' }),
            locText({ name: "formAddress", label: '"Delivery address" label' }),
            locText({ name: "formSubmit", label: "Submit button" }),
            locText({ name: "modeBook", label: '"Book a table" tab' }),
            locText({ name: "modeOrder", label: '"Order food" tab' }),
            locText({ name: "fulfillDineIn", label: '"Dine in" option' }),
            locText({ name: "fulfillTakeaway", label: '"Takeaway" option' }),
            locText({ name: "fulfillDelivery", label: '"Delivery" option' }),
          ],
        },
        {
          label: "WhatsApp messages",
          description:
            "The first line of the message that opens in WhatsApp when a customer orders. The order details are added underneath automatically.",
          fields: [
            locArea({ name: "waMsgIntro", label: "Table booking" }),
            locArea({ name: "waMsgIntroTakeaway", label: "Takeaway order" }),
            locArea({ name: "waMsgIntroDineIn", label: "Dine-in order" }),
            locArea({ name: "waMsgIntroDelivery", label: "Delivery order" }),
          ],
        },
      ],
    },
  ],
};
