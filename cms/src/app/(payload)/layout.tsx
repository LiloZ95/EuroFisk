/* Root layout for every Payload route. */
import type { ReactNode } from "react";
import config from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";

/**
 * Bridges the admin panel's client components to the server. Payload's UI calls this for
 * form state, document locking and live preview; without it the panel renders but its
 * interactive parts fail.
 */
const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
