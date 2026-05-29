/**
 * The four calm colourways shared across the whole range.
 * `fold`/`thumb` are CSS gradients used by the product swatch and cart thumbnail;
 * `stripe` is the self-band detail. Values ported verbatim from the source.
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
  bone: {
    id: "bone",
    name: "Bone",
    fold: "linear-gradient(135deg,#F2EBDC,#E2D7C2)",
    stripe: "#D8C7AE",
    thumb: "linear-gradient(135deg,#F2EBDC,#E2D7C2)",
  },
  sand: {
    id: "sand",
    name: "Warm Sand",
    fold: "linear-gradient(135deg,#E0D0B5,#CBB593)",
    stripe: "#B49B73",
    thumb: "linear-gradient(135deg,#E0D0B5,#CBB593)",
  },
  mist: {
    id: "mist",
    name: "Sea Mist",
    fold: "linear-gradient(135deg,#A4B6B3,#8FA3A0)",
    stripe: "#6F8682",
    thumb: "linear-gradient(135deg,#A4B6B3,#8FA3A0)",
  },
  terra: {
    id: "terra",
    name: "Terracotta",
    fold: "linear-gradient(135deg,#D4895F,#C8754B)",
    stripe: "#A85B38",
    thumb: "linear-gradient(135deg,#D4895F,#C8754B)",
  },
};

export const COLOURWAY_IDS = Object.keys(COLOURWAYS) as ColourwayId[];

export const DEFAULT_COLOURWAY: ColourwayId = "bone";
