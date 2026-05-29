import { StatCard, OwnershipSplitBar, CategoryBarChart, MappingDonut, PillarsBalance } from "@/components/Charts";
import { HEADLINE } from "@/lib/metrics";

export const metadata = { title: "Metrics — Rosetta" };

export default function MetricsPage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 reveal reveal-1">
          <p className="eyebrow mb-3 text-seam">Rendered from the gold marts</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold text-ink leading-tight">The guide, by the numbers</h1>
          <p className="text-lg text-graphite/90 mt-4 max-w-2xl leading-relaxed">
            Every figure here is computed from the same gold tables the pipeline produces — the
            governed metrics defined in the dbt semantic layer (<span className="font-mono text-sm">total_terms</span>,{" "}
            <span className="font-mono text-sm">total_pillars</span>, <span className="font-mono text-sm">clean_mapping_rate</span>).
            The shape of the guide at a glance — and quiet proof that it treats both products as equals.
          </p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 reveal reveal-2">
          {HEADLINE.map((h) => (
            <StatCard key={h.label} value={h.value} label={h.label} sub={h.sub} accent={h.accent} />
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal reveal-3">
          <OwnershipSplitBar />
          <PillarsBalance />
          <MappingDonut />
          <CategoryBarChart />
        </section>

        <p className="text-xs text-mute leading-relaxed mt-8 max-w-3xl">
          These charts read a curated snapshot of the gold marts. See the{" "}
          <span className="font-mono">/pipeline</span> directory in the repo for the dbt models and the
          MetricFlow definitions, and the ODI tab for how the data gets here.
        </p>
      </div>
    </main>
  );
}
