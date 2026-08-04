// The Arabic families sit behind the Latin ones: font fallback is resolved per glyph, so
// Latin text keeps DM Serif Display / Outfit while Arabic text falls through to Amiri / Cairo.
export const display = { fontFamily: "'DM Serif Display', 'Amiri', Georgia, serif" };
export const sans = { fontFamily: "'Outfit', 'Cairo', system-ui, sans-serif" };
