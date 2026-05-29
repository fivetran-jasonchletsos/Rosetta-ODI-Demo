// On-brand, dependency-free analytical charts (blueprint palette, Fraunces
// numerals). Pure server components — CSS handles motion, values are labeled
// directly so each chart reads cleanly on a slide.
import {
  stagesByOwner,
  pillarsByProduct,
  connectorsByCategory,
  connectorTotal,
  cleanMappings,
  boundaryGaps,
  termTotal,
  cleanMappingRate,
} from "@/lib/metrics";
import type { Owner } from "@/lib/content";

const FILL: Record<Owner, string> = { ft: "#2b6ef2", dbt: "#ff5c39", seam: "#0f9e8e" };

function ChartCard({ title, caption, children, accent = "seam" }: { title: string; caption: string; children: React.ReactNode; accent?: Owner }) {
  const bar = accent === "ft" ? "bar-ft" : accent === "dbt" ? "bar-dbt" : "bar-seam";
  return (
    <section className={`card ${bar} p-6`}>
      <h3 className="display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm text-graphite/75 mt-1 mb-5 leading-relaxed">{caption}</p>
      {children}
    </section>
  );
}

/* Stat card — big Fraunces number. */
export function StatCard({ value, label, sub, accent }: { value: string; label: string; sub: string; accent: Owner }) {
  const color = accent === "ft" ? "text-ft" : accent === "dbt" ? "text-dbt" : "text-seam";
  const bar = accent === "ft" ? "bar-ft" : accent === "dbt" ? "bar-dbt" : "bar-seam";
  return (
    <div className={`card ${bar} p-5`}>
      <p className={`display text-5xl font-semibold leading-none ${color}`}>{value}</p>
      <p className="text-sm font-medium text-ink mt-2">{label}</p>
      <p className="font-mono text-[10px] tracking-[0.12em] text-mute mt-0.5">{sub}</p>
    </div>
  );
}

/* Segmented 100% bar — pipeline ownership split. The equality thesis, visible. */
export function OwnershipSplitBar() {
  const total = stagesByOwner.reduce((a, b) => a + b.count, 0);
  return (
    <ChartCard
      title="Who owns the pipeline"
      caption="The six stages split evenly across Fivetran, the shared warehouse, and dbt. Two specialties, one road — not an acquirer and an acquired."
      accent="seam"
    >
      <div className="flex h-12 w-full overflow-hidden rounded-md border border-line">
        {stagesByOwner.map((s) => (
          <div
            key={s.owner}
            className="flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${(s.count / total) * 100}%`, background: FILL[s.owner] }}
          >
            {s.label} · {s.count}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 font-mono text-[10px] tracking-[0.12em] text-mute">
        <span>SOURCES</span><span>CONSUME</span>
      </div>
    </ChartCard>
  );
}

/* Horizontal bar chart — connectors by source category. */
export function CategoryBarChart() {
  const max = Math.max(...connectorsByCategory.map((c) => c.count));
  return (
    <ChartCard
      title="Connector breadth"
      caption={`${connectorTotal} reference connectors across five source categories — the shape of what Fivetran lands before dbt ever sees it.`}
      accent="ft"
    >
      <div className="space-y-2.5">
        {connectorsByCategory.map((c) => (
          <div key={c.label} className="grid grid-cols-[7rem_1fr_1.5rem] items-center gap-3">
            <span className="text-sm text-graphite truncate">{c.label}</span>
            <div className="h-5 rounded bg-sunk overflow-hidden">
              <div className="h-full rounded" style={{ width: `${(c.count / max) * 100}%`, background: FILL.ft }} />
            </div>
            <span className="font-mono text-xs text-ink text-right">{c.count}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* Donut — clean mappings vs boundary gaps. */
export function MappingDonut() {
  const r = 42;
  const c = 2 * Math.PI * r;
  const cleanLen = c * (cleanMappings / termTotal);
  const pct = Math.round(cleanMappingRate * 100);
  return (
    <ChartCard
      title="Translation surface"
      caption={`${cleanMappings} of ${termTotal} term pairs map cleanly between the two products. ${boundaryGaps} are genuine boundary gaps (MAR↔seats, source-freshness↔move) — and the guide says so.`}
      accent="dbt"
    >
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="w-28 h-28 flex-none -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#eceae2" strokeWidth="12" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={FILL.seam} strokeWidth="12"
            strokeDasharray={`${cleanLen} ${c - cleanLen}`} strokeLinecap="butt" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={FILL.dbt} strokeWidth="12"
            strokeDasharray={`${c - cleanLen} ${cleanLen}`} strokeDashoffset={-cleanLen} strokeLinecap="butt" />
        </svg>
        <div>
          <p className="display text-4xl font-semibold text-seam leading-none">{pct}%</p>
          <p className="text-sm text-ink mt-1">map cleanly</p>
          <div className="mt-3 space-y-1 font-mono text-[11px] text-graphite">
            <p><span className="dot dot--seam mr-1.5" />{cleanMappings} clean mappings</p>
            <p><span className="dot dot--dbt mr-1.5" />{boundaryGaps} boundary gaps</p>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

/* Two-column balance — pillars per product, deliberately equal. */
export function PillarsBalance() {
  const max = Math.max(...pillarsByProduct.map((p) => p.count));
  return (
    <ChartCard
      title="Equal coverage"
      caption="Each product gets the same depth — six explainer pillars apiece. Design choice, not coincidence: neither half reads as the junior partner."
      accent="seam"
    >
      <div className="flex items-end justify-center gap-10 h-40 pt-2">
        {pillarsByProduct.map((p) => (
          <div key={p.product} className="flex flex-col items-center gap-2">
            <span className="display text-2xl font-semibold text-ink">{p.count}</span>
            <div
              className="w-16 rounded-t"
              style={{ height: `${(p.count / max) * 100}%`, background: FILL[p.key] }}
            />
            <span className="text-sm text-graphite">{p.product}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
