// WebP, resized to roughly 2x the largest size each asset is actually rendered at.
// The original JPEG/PNG files are still in src/imports for re-exporting at other sizes;
// they are no longer imported, so Vite does not bundle them.
import logoImg from "@/imports/eurofisk-logo-transparent.webp";
import heroImg from "@/imports/720946626_18111809275785649_9222392841617946435_n.webp";
import foodSpreadImg from "@/imports/719301082_18111809287785649_8243644206559662839_n.webp";
import shrimpPlatterImg from "@/imports/725191264_18113287450785649_8734965326228817069_n.webp";
import interiorImg from "@/imports/725947039_18113287858785649_7163341319390753622_n.webp";
import rawFishImg from "@/imports/581500223_1125924292862114_7329200820988390004_n.webp";
import guldsparidCard from "@/imports/740594412_1303242941796914_1231758959184970134_n.webp";
import laxfileCard from "@/imports/737550945_1303242938463581_1649297779520794798_n.webp";
import havsabborreCard from "@/imports/738040921_1303242945130247_8074259589386338750_n.webp";
import exteriorImg from "@/imports/566195161_1102427925211751_5067642239529561451_n.webp";

/** Intrinsic size of the nav/footer logo, so it reserves its box before loading. */
export const LOGO_SIZE = { width: 480, height: 275 };

export {
  logoImg, heroImg, foodSpreadImg, shrimpPlatterImg, interiorImg,
  rawFishImg, guldsparidCard, laxfileCard, havsabborreCard, exteriorImg,
};
