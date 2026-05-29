# Rosetta — Fivetran + dbt enablement field guide

An internal "Rosetta Stone" for the Fivetran + dbt Labs merger. It helps Fivetran
people understand dbt and dbt people understand Fivetran, with the framing **one
pipeline, two fluencies** — equal weight to both halves, no acquirer-and-acquired
hierarchy.

Live: https://fivetran-jasonchletsos.github.io/Rosetta-ODI-Demo/

## What's inside

| Tab | What it does |
| --- | --- |
| **Pipeline** | Interactive combined pipeline — click any of the six stages (Sources → Move → Land/Store → Transform → Define → Consume) to see what it is, who owns it, and what each side calls it. Audience toggle re-weights the view. |
| **Fivetran** | Six pillars for a dbt audience: connectors, destinations, activations & transformations, deployment models, security & networking, core concepts (incl. MAR). Each with "why the other side should care." |
| **dbt** | Six pillars for a Fivetran audience: Core/Cloud/Fusion, building blocks, testing & data quality, semantic layer, orchestration, where dbt meets Fivetran. |
| **Builder** | Interactive config builder. Pick a source, destination, deployment + networking + column policy on the Fivetran half, then materialization, tests, semantic layer, and orchestration on the dbt half. Renders a live spec sheet you can **print to a clean black-and-white PDF**. |
| **Translate** | Fourteen terminology pairs mapping a Fivetran concept to its dbt analog — with a note on where the boundary genuinely is. Searchable, with a lead-side toggle. |
| **Day in the Life** | Side-by-side workday of a Fivetran admin and an analytics engineer, the handoff moments, and myths worth retiring. |
| **ODI** | How this app is built, and an honest note on what's curated vs synced. |

## Accuracy

Product facts were checked against Fivetran and dbt documentation as of early 2026.
Moving targets are flagged inline where they appear:

- the **dbt Fusion engine** is in preview, not GA;
- the **merger** is announced and pending close;
- **Great Expectations** integration depth into the combined platform is emerging;
- **HVR** is no longer a separate product line — its log-based replication folded into the standard CDC story.

## Stack

Next.js 14 (App Router, static export) · React 18 · Tailwind CSS · TypeScript.
Deployed to GitHub Pages via Actions. Theme: a light "blueprint / spec-sheet"
aesthetic with Fivetran blue and dbt coral as two equal accents and a teal seam
for the shared warehouse.

## Develop

```bash
cd rosetta-app
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```
