// Numbers, ranges and phone numbers are shared verbatim across all three languages, but the
// Unicode bidi algorithm reorders them inside an Arabic (RTL) paragraph: "10:00-19:00" comes
// out as "19:00-10:00" and "+46 79 016 48 13" puts the plus sign on the wrong end. Wrapping
// such a run in an LTR isolate pins its internal order. The two marks are zero-width, so the
// same string stays correct in Swedish and English.

const LRI = "⁦"; // LEFT-TO-RIGHT ISOLATE
const PDI = "⁩"; // POP DIRECTIONAL ISOLATE

export function ltr(text: string) {
  return `${LRI}${text}${PDI}`;
}

/** Drops the isolates again — for <title> and <meta> values, which are plain text to crawlers. */
export function stripBidi(text: string) {
  return text.replace(/[⁦-⁩‎‏]/g, "");
}
