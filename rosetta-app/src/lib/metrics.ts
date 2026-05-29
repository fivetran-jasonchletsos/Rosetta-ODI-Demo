// ─────────────────────────────────────────────────────────────────────────
// Metrics derived from the canonical content model — the in-app mirror of the
// gold dbt marts (dim_pipeline_stage, dim_product_pillar, fct_term_translation)
// and the MetricFlow metrics (total_terms, total_pillars, clean_mapping_rate).
// Everything here is computed, not hand-typed, so the dashboard stays in sync.
// ─────────────────────────────────────────────────────────────────────────
import { STAGES, FIVETRAN_PILLARS, DBT_PILLARS, TERMS, OWNER_LABEL, type Owner } from "@/lib/content";
import { SOURCE_CATEGORIES } from "@/lib/builder";

// Pipeline-stage ownership — the equality thesis, in numbers.
export const stagesByOwner: { owner: Owner; label: string; count: number }[] = (
  ["ft", "seam", "dbt"] as Owner[]
).map((o) => ({ owner: o, label: OWNER_LABEL[o], count: STAGES.filter((s) => s.owner === o).length }));

export const stageTotal = STAGES.length;

// Explainer pillars per product — equal coverage, 6 and 6.
export const pillarsByProduct: { product: string; key: Owner; count: number }[] = [
  { product: "Fivetran", key: "ft", count: FIVETRAN_PILLARS.length },
  { product: "dbt", key: "dbt", count: DBT_PILLARS.length },
];
export const pillarTotal = FIVETRAN_PILLARS.length + DBT_PILLARS.length;

// Connector breadth, by source category (from the config-builder catalog).
export const connectorsByCategory = SOURCE_CATEGORIES.map((c) => ({
  label: c.label,
  count: c.connectors.length,
})).sort((a, b) => b.count - a.count);
export const connectorTotal = connectorsByCategory.reduce((a, b) => a + b.count, 0);

// Terminology mapping — mirrors fct_term_translation.maps_cleanly. Boundary gaps
// are pairs flagged gap:true on the term itself (the data carries the flag), so
// editing a term label can't silently change the count.
export const termTotal = TERMS.length;
export const boundaryGaps = TERMS.filter((t) => t.gap).length;
export const cleanMappings = termTotal - boundaryGaps;
export const cleanMappingRate = cleanMappings / termTotal;

// Headline stat cards.
export const HEADLINE = [
  { value: String(termTotal), label: "term pairs", sub: "Fivetran ↔ dbt", accent: "seam" as Owner },
  { value: String(pillarTotal), label: "explainer pillars", sub: `${pillarsByProduct[0].count} Fivetran · ${pillarsByProduct[1].count} dbt`, accent: "ft" as Owner },
  { value: String(stageTotal), label: "pipeline stages", sub: "source → consume", accent: "dbt" as Owner },
  { value: `${Math.round(cleanMappingRate * 100)}%`, label: "map cleanly", sub: `${cleanMappings} of ${termTotal} terms`, accent: "seam" as Owner },
];
