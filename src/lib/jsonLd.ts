import { FAQS } from "./faqs-data";
import { MATERIAL, PRODUCTS } from "./products";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN, SITE_URL } from "./site";

/**
 * Builds the schema.org @graph (Organization, WebSite, ItemList of Products,
 * FAQPage) ported from the static storefront. Returned as a plain object so it
 * can be serialised with JSON.stringify and injected via dangerouslySetInnerHTML.
 *
 * The graph is loosely typed as JsonLdGraph rather than a full schema.org type
 * surface — strict enough to catch shape mistakes, pragmatic about @-prefixed
 * keys and nested unions.
 */
type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdNode
  | readonly JsonLdValue[];

interface JsonLdNode {
  readonly [key: string]: JsonLdValue;
}

export interface JsonLdGraph {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly JsonLdNode[];
}

const ORG_ID = `${SITE_URL}/#org`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function buildJsonLd(): JsonLdGraph {
  const organization: JsonLdNode = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    slogan: SITE_SLOGAN,
    description:
      "Saltmist makes plush, quick-drying towels made with bamboo viscose and cotton. Designed in Australia, made in Thailand.",
    logo: `${SITE_URL}/og-image.jpg`,
    areaServed: "AU",
  };

  const website: JsonLdNode = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-AU",
  };

  const itemList: JsonLdNode = {
    "@type": "ItemList",
    name: "Saltmist towels",
    itemListElement: PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.schemaDesc,
        brand: { "@id": ORG_ID },
        material: MATERIAL,
        offers: {
          "@type": "Offer",
          price: product.price.toFixed(2),
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  const faqPage: JsonLdNode = {
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.schema.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.schema.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, itemList, faqPage],
  };
}

export const description = SITE_DESCRIPTION;
