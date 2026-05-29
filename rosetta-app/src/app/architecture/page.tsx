export const metadata = { title: "ODI architecture — Rosetta" };

const LAYERS = [
  { name: "Sources", what: "Fivetran product docs, dbt developer docs, and the merger announcement — the raw material this guide is built from." },
  { name: "Fivetran (move)", what: "Managed connectors land raw doc and reference data into the lake. In the reference pattern, this is the E + L the whole guide describes." },
  { name: "Iceberg / S3 ⇄ warehouse", what: "Open table format in object storage, mirrored into Snowflake / Databricks / BigQuery. The shared seam — where Fivetran hands off to dbt." },
  { name: "dbt (transform)", what: "bronze → silver → gold models, tested and documented. Lineage is the DAG; the gold layer is what the front end reads." },
  { name: "Front end", what: "This Next.js app — static-exported, deployed on GitHub Pages. Curated enablement content sits on top of the gold layer." },
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
          <pre className="font-mono text-[12px] leading-relaxed text-graphite overflow-x-auto">{`     Fivetran docs   dbt docs   Merger announcement
              \\           |            /
               Fivetran  (managed connectors)
                          |
            S3 + Iceberg  ⇄  Snowflake / Databricks / BigQuery
                          |
                         dbt   (bronze → silver → gold)
                          |
        ┌─────────────────┼──────────────────┐
   Pipeline view    Translation table    Config builder
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
            The diagram above is the reference ODI architecture this guide teaches. This particular app ships
            curated, hand-verified enablement content rather than rows from a live warehouse — accuracy mattered
            more than a synced pipeline for an internal field guide. The product facts were checked against
            Fivetran and dbt documentation as of early 2026, with moving targets (the Fusion engine&apos;s GA, the
            merger close, the depth of Great Expectations integration) flagged inline wherever they appear.
          </p>
        </section>
      </div>
    </main>
  );
}
