import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/CartProvider";
import { buildJsonLd } from "@/lib/jsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

// Both are variable fonts: omit `weight` to ship the full axis range. Fraunces
// also exposes the optical-size axis, which we want for the soft display look.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Saltmist — Softness, settled. Plush bath towels made with bamboo viscose.",
    template: "%s · Saltmist",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "bamboo towels",
    "bamboo viscose towels",
    "cotton bamboo towels",
    "plush bath towels",
    "650 gsm towels",
    "quick dry towels",
    "bath sheet",
    "hand towel",
    "Australia",
  ],
  alternates: {
    // Canonical resolves against metadataBase → https://www.saltmist.com.au/
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
      "Saltmist — Softness, settled. Plush towels made with bamboo viscose.",
    description:
      "Plush, quick-drying 650 GSM towels made with bamboo viscose and cotton. Considered design, honest labelling. Designed in Australia, made in Thailand.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Saltmist bamboo viscose towels in Bone, Warm Sand, Sea Mist and Terracotta.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saltmist — Softness, settled.",
    description:
      "Plush, quick-drying 650 GSM towels made with bamboo viscose and cotton. Designed in Australia, made in Thailand.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: {
      url:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23F4EFE6'/%3E%3Cpath d='M5 19c4-4 6 4 11 0s5-4 11 0' stroke='%23C8754B' stroke-width='2.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
      type: "image/svg+xml",
    },
  },
  other: {
    "geo.region": "AU",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = buildJsonLd();

  return (
    <html lang="en-AU" className={`${fraunces.variable} ${inter.variable}`}>
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
