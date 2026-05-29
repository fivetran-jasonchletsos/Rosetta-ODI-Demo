import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Blueprint / spec-sheet palette.
        // Neutral paper + ink, with two EQUAL brand accents — Fivetran blue
        // and dbt coral — plus a teal "seam" for the shared warehouse where
        // the two halves of the pipeline meet. No accent outranks the other.
        paper:    "#f5f4ef", // base background — warm off-white drafting paper
        panel:    "#ffffff", // card surface
        sunk:     "#eceae2", // inset / track
        ink:      "#15171c", // near-black body text
        graphite: "#373c47", // secondary text
        mute:     "#6b7180", // tertiary / captions
        line:     "#e1ded4", // hairline borders
        ft:       "#2b6ef2", // Fivetran blue — data movement
        ftdeep:   "#1b4fc4",
        ftsoft:   "#e9f1fe",
        dbt:      "#ff5c39", // dbt coral — transformation
        dbtdeep:  "#dd431d",
        dbtsoft:  "#fff0eb",
        seam:     "#0f9e8e", // teal — the shared warehouse / handoff
        seamdeep: "#0b7468",
        seamsoft: "#e4f5f2",
      },
      fontFamily: {
        display: ["var(--font-space)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Helvetica", "Arial", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
