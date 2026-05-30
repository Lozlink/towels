/**
 * The four ZYNZYA colourways shared across the whole range.
 * `fold`/`thumb` are CSS gradients used by the product swatch and cart thumbnail;
 * `stripe` is the self-band detail.
 *
 * NOTE: the four KEYS (`bone`/`sand`/`mist`/`terra`) are the stable colourway
 * IDs the order API validates against (see orders/pricing.ts → isColourwayId).
 * They are kept identical so the cart/checkout contract keeps working — only the
 * display `name` and the gradient swatches are rebranded to the ZYNZYA triad.
 */
export type ColourwayId = "bone" | "sand" | "mist" | "terra";

export interface Colourway {
  readonly id: ColourwayId;
  readonly name: string;
  readonly fold: string;
  readonly stripe: string;
  readonly thumb: string;
}

export const COLOURWAYS: Record<ColourwayId, Colourway> = {
  // id `bone` → natural undyed cream.
  bone: {
    id: "bone",
    name: "Raw Bamboo",
    fold: "linear-gradient(135deg,#FBF6EC,#ECD9A6)",
    stripe: "#E0C781",
    thumb: "linear-gradient(135deg,#FBF6EC,#ECD9A6)",
  },
  // id `sand` → marigold.
  sand: {
    id: "sand",
    name: "Marigold",
    fold: "linear-gradient(135deg,#F8C84B,#F4B81E)",
    stripe: "#D89E12",
    thumb: "linear-gradient(135deg,#F8C84B,#F4B81E)",
  },
  // id `mist` → bamboo green.
  mist: {
    id: "mist",
    name: "Bamboo Green",
    fold: "linear-gradient(135deg,#2BBD6B,#1FA85C)",
    stripe: "#178A4A",
    thumb: "linear-gradient(135deg,#2BBD6B,#1FA85C)",
  },
  // id `terra` → warm scarlet.
  terra: {
    id: "terra",
    name: "Scarlet",
    fold: "linear-gradient(135deg,#E8584B,#DC3A2C)",
    stripe: "#B92C20",
    thumb: "linear-gradient(135deg,#E8584B,#DC3A2C)",
  },
};

export const COLOURWAY_IDS = Object.keys(COLOURWAYS) as ColourwayId[];

export const DEFAULT_COLOURWAY: ColourwayId = "bone";
