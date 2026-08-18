/**
 * The admin panel ships its own stylesheet from @payloadcms/ui and needs no PostCSS
 * plugins. This file exists so Next stops walking up to the Vite site's postcss config,
 * whose `export default {}` is valid for Vite but rejected by Next.
 */
export default { plugins: {} };
