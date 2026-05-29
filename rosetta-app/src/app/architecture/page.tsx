export const metadata = { title: "ODI architecture — Rosetta" };

const LAYERS = [
  { name: "rosetta_source", what: "A Fivetran Connector SDK source. Incremental, watermark-based, MAR-conscious — lands the connector catalog, pipeline stages, product pillars, and term map into the raw schema." },
  { name: "Raw + Iceberg lake", what: "ANALYTICS.jason_chletsos_rosetta — the raw landed tables, mirrored to Apache Iceberg on S3 so Snowflake, Spark, and the Managed Data Lake read the same open files." },
  { name: "dbt (the seam)", what: "source() points at exactly what the connector wrote. staging (views) → marts (tables with enforced contracts): dim_pipeline_stage, dim_product_pillar, fct_term_translation, dim_connector. Plus a MetricFlow semantic layer." },
  { name: "Quality gate", what: "dbt tests run inside the DAG; a standalone Great Expectations checkpoint then validates the published marts. Two layers — the combined move + transform + validate story." },
  { name: "Front end", what: "This Next.js app — static-exported on GitHub Pages. It renders a curated snapshot of the gold marts; the prose is hand-authored on top of the modeled data." },
];

export default function ArchitecturePage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow mb-3 text-seam">ODI architecture</p>
        <h1 className="display text-4xl sm:text-5xl font-semibold text-ink mb-4 leading-tight">Built on the stack it explains.</h1>
        <p className="text-lg text-graphite/90 mb-10 max-w-2xl leading-relaxed">
          Rosetta is itself an Open Data Infrastructure demo. It follows the same reference pattern every
          ODI demo uses — Fivetran moves data into an open lake, dbt models it, the front end reads gold.
          That pattern <em>is</em> the subject of this guide.
        </p>

        <section className="card p-6 mb-8">
          <h2 className="eyebrow mb-5">Pipeline diagram</h2>
          <pre className="font-mono text-[12px] leading-relaxed text-graphite overflow-x-auto">{`   catalog · stages · pillars · terms
                   │
        rosetta_source  (Fivetran Connector SDK · incremental)
                   │
   ANALYTICS.jason_chletsos_rosetta  ⇄  Iceberg lake (S3)
                   │   ← the seam: dbt source() reads what the connector wrote
                  dbt   staging (views) → marts (contracts) → semantic
                   │
        dbt tests  +  Great Expectations gate  →  dbt docs
                   │
        ┌──────────┼───────────────────┐
   Pipeline view   Translation table   Config builder
                (this Next.js front end)`}</pre>
        </section>

        <section className="card p-6 mb-8">
          <h2 className="eyebrow mb-5">Layers</h2>
          <ul className="divide-y divide-line">
            {LAYERS.map((l, i) => (
              <li key={l.name} className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-3 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className={`dot ${i <= 1 ? "dot--ft" : i === 2 ? "dot--seam" : "dot--dbt"}`} />
                  <p className="font-mono text-sm text-ink">{l.name}</p>
                </div>
                <p className="text-sm text-graphite/85 leading-relaxed">{l.what}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card bar-seam p-6">
          <h2 className="eyebrow mb-3 text-seam">A note on honesty</h2>
          <p className="text-sm text-graphite/90 leading-relaxed max-w-3xl">
            This pipeline ships as runnable artifacts in the repo under <span className="font-mono">/pipeline</span> —
            the Connector SDK source, the dbt project, the Great Expectations suite, the Airflow DAG, and the
            Snowflake / Iceberg DDL. The structured guide data (stages, pillars, terms) is genuinely modeled in
            the dbt marts. The deployed static site renders a curated snapshot of those gold tables, and the
            explanatory prose is hand-authored on top — accuracy mattered more than a live sync for an internal
            field guide. Product facts were checked against Fivetran and dbt documentation as of early 2026, with
            moving targets (the Fusion engine&apos;s GA, the merger close, the depth of Great Expectations
            integration) flagged inline wherever they appear.
          </p>
        </section>
      </div>
    </main>
  );
}
