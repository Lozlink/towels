export interface Product {
  readonly id: string;
  /** Stable, human-readable SKU — the line-item key the order API trusts. */
  readonly sku: string;
  readonly name: string;
  /** Short marketing line shown on the product card. */
  readonly desc: string;
  /** Longer, claims-safe description used for JSON-LD structured data. */
  readonly schemaDesc: string;
  readonly price: number;
  /** Compare-at price, when the SKU is a saving (the bundle). */
  readonly was?: number;
  /** Whether the card spans two columns in the grid. */
  readonly feature: boolean;
  /** Optional badge text shown on the swatch. */
  readonly tag?: string;
}

/** Single source of cloth truth — kept identical across every SKU for honesty. */
export const MATERIAL = "100% bamboo fibre" as const;

export const PRODUCTS: readonly Product[] = [
  {
    id: "bath",
    sku: "bath-towel",
    name: "The Everyday Bath Towel",
    desc: "The core hero. 100% bamboo fibre, plush at 650 GSM. 70 × 140 cm.",
    schemaDesc:
      "Plush 650 GSM bath towel (70 x 140 cm) made from 100% bamboo fibre — unblended, no viscose, cotton or polyester. Soft, breathable and naturally absorbent. Designed in Australia, made in Thailand.",
    price: 49,
    feature: true,
    tag: "Bestseller",
  },
  {
    id: "sheet",
    sku: "bath-sheet",
    name: "The Bath Sheet",
    desc: "A larger wrap-around format in 100% bamboo fibre. 90 × 170 cm.",
    schemaDesc:
      "Oversized 650 GSM bath sheet (90 x 170 cm) made from 100% bamboo fibre — unblended. Soft, breathable and naturally absorbent. Designed in Australia, made in Thailand.",
    price: 69,
    feature: false,
  },
  {
    id: "hand",
    sku: "hand-towel",
    name: "The Hand Towel",
    desc: "Everyday basin companion in 100% bamboo fibre. 40 × 70 cm.",
    schemaDesc:
      "650 GSM hand towel made from 100% bamboo fibre — unblended. Soft and breathable. Designed in Australia, made in Thailand.",
    price: 24,
    feature: false,
  },
  {
    id: "face",
    sku: "face-cloth-2",
    name: "The Face Cloth (set of 2)",
    desc: "Soft daily washers in 100% bamboo fibre. 30 × 30 cm, pair.",
    schemaDesc:
      "Set of two soft face cloths made from 100% bamboo fibre — unblended. Designed in Australia, made in Thailand.",
    price: 19,
    feature: false,
  },
  {
    id: "bundle",
    sku: "complete-bundle",
    name: "The Complete Bundle",
    desc: "2 bath towels, 2 hand towels, 2 face cloths — your whole bathroom in 100% bamboo fibre.",
    schemaDesc:
      "Two bath towels, two hand towels and two face cloths made from 100% bamboo fibre — unblended. Designed in Australia, made in Thailand.",
    price: 149,
    was: 181,
    feature: true,
    tag: "Save $32",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Look a product up by its stable SKU — the key the order API trusts. */
export function getProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}
