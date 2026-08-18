import type { CollectionConfig } from "payload";

/**
 * Who can log in to the admin panel. Payload handles password hashing, sessions and the
 * login screen; this collection only decides who exists and what they may do.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 8, // a working day
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
  },
  labels: { singular: "User", plural: "Users" },
  admin: {
    useAsTitle: "email",
    description: "People who can log in and edit the website.",
    group: "Settings",
  },
  access: {
    // Only admins manage accounts; editors can still update their own record (password etc).
    create: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
    update: ({ req, id }) => req.user?.role === "admin" || req.user?.id === id,
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Editor — can change content", value: "editor" },
        { label: "Admin — can also manage users", value: "admin" },
      ],
      access: {
        // An editor must not be able to promote themselves.
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
