import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const OG_IMAGE = "https://fivetran-jasonchletsos.github.io/Rosetta-ODI-Demo/og.png";

export const metadata: Metadata = {
  title: "Rosetta — Fivetran and dbt, one pipeline",
  description:
    "An internal field guide for the Fivetran + dbt Labs merger. What each side needs to understand about the other: connectors, destinations, activations, deployment and security modes on the Fivetran side; models, tests, the semantic layer, Core/Cloud/Fusion on the dbt side. Includes an interactive pipeline view, a config builder, and a terminology translation table.",
  openGraph: {
    title: "Rosetta — Fivetran and dbt, one pipeline",
    description: "One pipeline, two fluencies. The canonical joint story for the Fivetran + dbt Labs merger.",
    url: "https://fivetran-jasonchletsos.github.io/Rosetta-ODI-Demo/",
    siteName: "Rosetta · ODI Demo",
    images: [{ url: OG_IMAGE, width: 1920, height: 1080, alt: "Rosetta — one pipeline, two fluencies" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosetta — Fivetran and dbt, one pipeline",
    description: "One pipeline, two fluencies. The canonical joint story for the Fivetran + dbt Labs merger.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="blueprint min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Script src="/feedback-widget.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
