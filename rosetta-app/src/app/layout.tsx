import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Rosetta — Fivetran and dbt, one pipeline",
  description:
    "An internal field guide for the Fivetran + dbt Labs merger. What each side needs to understand about the other: connectors, destinations, activations, deployment and security modes on the Fivetran side; models, tests, the semantic layer, Core/Cloud/Fusion on the dbt side. Includes an interactive pipeline view, a config builder, and a terminology translation table.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body className="blueprint min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
