import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/CartProvider";
import { buildJsonLd } from "@/lib/jsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

// Both are variable fonts: omit `weight` to ship the full axis range.
// Bricolage Grotesque is the characterful display face; Hanken Grotesk is the
// clean grotesque body. They wire into the Tailwind @theme via CSS variables.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "ZYNZYA — Towels made from 100% bamboo fibre. No viscose. No blend.",
    template: "%s · ZYNZYA",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "bamboo towels",
    "100% bamboo towels",
    "bamboo fibre towels",
    "unblended bamboo towels",
    "plush bath towels",
    "650 gsm towels",
    "bath sheet",
    "hand towel",
    "Australia",
  ],
  alternates: {
    // Canonical resolves against metadataBase → https://www.zynzya.com.au/
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: "/",
    title:
      "ZYNZYA — Towels made from 100% bamboo fibre. No viscose. No blend.",
    description:
      "Towels made from 100% bamboo fibre — unblended, with no viscose, cotton or polyester. Soft, breathable, biodegradable. Designed in Australia, made in Thailand.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZYNZYA towels in Bamboo Green, Scarlet, Marigold and Cream — 100% bamboo fibre.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZYNZYA — 100% bamboo fibre towels.",
    description:
      "Towels made from 100% bamboo fibre — unblended. Soft, breathable, biodegradable. Designed in Australia, made in Thailand.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: {
      // PLACEHOLDER tribal emblem (see README → "Logo / brand mark"). A woven
      // diamond motif in the ZYNZYA triad; swap for the client's supplied mark.
      url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230E3B26'/%3E%3Cpath d='M16 5l11 11-11 11L5 16z' fill='none' stroke='%231FA85C' stroke-width='2.4'/%3E%3Cpath d='M16 11l5 5-5 5-5-5z' fill='%23F4B81E'/%3E%3Ccircle cx='16' cy='16' r='2' fill='%23DC3A2C'/%3E%3C/svg%3E",
      type: "image/svg+xml",
    },
  },
  other: {
    "geo.region": "AU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E3B26",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = buildJsonLd();

  return (
    <html lang="en-AU" className={`${bricolage.variable} ${hanken.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Structured data is a fixed, typed object built at build/render time;
          // no user input flows into it, so serialising is safe here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
