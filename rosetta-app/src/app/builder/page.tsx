"use client";

import { useMemo, useState } from "react";
import {
  SOURCE_CATEGORIES,
  DESTINATIONS,
  DEPLOYMENT_MODES,
  COLUMN_POLICIES,
  SYNC_FREQUENCIES,
  MATERIALIZATIONS,
  TEST_OPTIONS,
  SCHEDULE_OPTIONS,
  SEMANTIC_OPTIONS,
  netModesFor,
} from "@/lib/builder";

function Choice({
  active,
  onClick,
  children,
  accent = "ft",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "ft" | "dbt" | "seam";
}) {
  const on =
    accent === "ft" ? "border-ft bg-ftsoft text-ftdeep" : accent === "dbt" ? "border-dbt bg-dbtsoft text-dbtdeep" : "border-seam bg-seamsoft text-seamdeep";
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${active ? on : "border-line bg-panel text-graphite hover:text-ink hover:border-mute/40"}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children, accent = "ft" }: { label: string; children: React.ReactNode; accent?: "ft" | "dbt" | "seam" }) {
  const t = accent === "ft" ? "text-ft" : accent === "dbt" ? "text-dbt" : "text-seam";
  return (
    <div>
      <p className={`font-mono text-[10px] tracking-[0.15em] mb-2 ${t}`}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function BuilderPage() {
  // Fivetran half
  const [catId, setCatId] = useState(SOURCE_CATEGORIES[0].id);
  const cat = SOURCE_CATEGORIES.find((c) => c.id === catId)!;
  const [connector, setConnector] = useState(cat.connectors[0]);
  const netModes = useMemo(() => netModesFor(catId), [catId]);
  const [net, setNet] = useState(netModes[0].id);
  const [dest, setDest] = useState(DESTINATIONS[0]);
  const [deploy, setDeploy] = useState(DEPLOYMENT_MODES[0].id);
  const [colPolicy, setColPolicy] = useState(COLUMN_POLICIES[0].id);
  const [freq, setFreq] = useState(SYNC_FREQUENCIES[2]);

  // dbt half
  const [mat, setMat] = useState(MATERIALIZATIONS[2].id);
  const [tests, setTests] = useState<string[]>(["not_null", "unique"]);
  const [semantic, setSemantic] = useState(SEMANTIC_OPTIONS[0].id);
  const [schedule, setSchedule] = useState(SCHEDULE_OPTIONS[0].id);

  function pickCategory(id: string) {
    const c = SOURCE_CATEGORIES.find((x) => x.id === id)!;
    setCatId(id);
    setConnector(c.connectors[0]);
    setNet(netModesFor(id)[0].id);
  }
  function toggleTest(id: string) {
    setTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  const deployMode = DEPLOYMENT_MODES.find((d) => d.id === deploy)!;
  const netLabel = netModes.find((m) => m.id === net)?.label ?? "";
  const colLabel = COLUMN_POLICIES.find((c) => c.id === colPolicy)!.label;
  const matObj = MATERIALIZATIONS.find((m) => m.id === mat)!;
  const semObj = SEMANTIC_OPTIONS.find((s) => s.id === semantic)!;
  const schedObj = SCHEDULE_OPTIONS.find((s) => s.id === schedule)!;

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 no-print">
          <p className="eyebrow mb-3">Interactive</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold text-ink leading-tight">Config builder</h1>
          <p className="text-lg text-graphite/90 mt-4 max-w-2xl leading-relaxed">
            Assemble a full pipeline — the Fivetran half (source through destination) and the dbt half
            (transform through metrics). The spec sheet on the right updates live. Print it to a clean
            black-and-white PDF for a deck or a runbook.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          {/* ── Controls ── */}
          <div className="no-print space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="dot dot--ft" />
                <h2 className="display text-xl font-semibold text-ink">Fivetran — move it in</h2>
              </div>
              <div className="space-y-5">
                <Field label="SOURCE CATEGORY" accent="ft">
                  {SOURCE_CATEGORIES.map((c) => (
                    <Choice key={c.id} active={c.id === catId} onClick={() => pickCategory(c.id)} accent="ft">{c.label}</Choice>
                  ))}
                </Field>
                <Field label="CONNECTOR" accent="ft">
                  {cat.connectors.map((c) => (
                    <Choice key={c} active={c === connector} onClick={() => setConnector(c)} accent="ft">{c}</Choice>
                  ))}
                </Field>
                <div className="rounded border border-line bg-ftsoft/40 px-3 py-2">
                  <p className="text-xs text-graphite"><span className="font-mono text-[10px] text-ft tracking-[0.15em]">EXTRACTION&nbsp;</span> {cat.method} <span className="text-mute">(set by source type)</span></p>
                </div>
                <Field label="DESTINATION" accent="seam">
                  {DESTINATIONS.map((d) => (
                    <Choice key={d} active={d === dest} onClick={() => setDest(d)} accent="seam">{d}</Choice>
                  ))}
                </Field>
                <Field label="DEPLOYMENT MODE" accent="ft">
                  {DEPLOYMENT_MODES.map((d) => (
                    <Choice key={d.id} active={d.id === deploy} onClick={() => setDeploy(d.id)} accent="ft">{d.label}</Choice>
                  ))}
                </Field>
                <Field label="NETWORKING" accent="ft">
                  {netModes.map((m) => (
                    <Choice key={m.id} active={m.id === net} onClick={() => setNet(m.id)} accent="ft">{m.label}</Choice>
                  ))}
                </Field>
                <Field label="COLUMN POLICY" accent="ft">
                  {COLUMN_POLICIES.map((c) => (
                    <Choice key={c.id} active={c.id === colPolicy} onClick={() => setColPolicy(c.id)} accent="ft">{c.label}</Choice>
                  ))}
                </Field>
                <Field label="SYNC FREQUENCY" accent="ft">
                  {SYNC_FREQUENCIES.map((f) => (
                    <Choice key={f} active={f === freq} onClick={() => setFreq(f)} accent="ft">{f}</Choice>
                  ))}
                </Field>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="dot dot--dbt" />
                <h2 className="display text-xl font-semibold text-ink">dbt — model and test it</h2>
              </div>
              <div className="space-y-5">
                <Field label="MART MATERIALIZATION" accent="dbt">
                  {MATERIALIZATIONS.map((m) => (
                    <Choice key={m.id} active={m.id === mat} onClick={() => setMat(m.id)} accent="dbt">{m.label}</Choice>
                  ))}
                </Field>
                <Field label="TESTS (multi-select)" accent="dbt">
                  {TEST_OPTIONS.map((t) => (
                    <Choice key={t.id} active={tests.includes(t.id)} onClick={() => toggleTest(t.id)} accent="dbt">{t.label}</Choice>
                  ))}
                </Field>
                <Field label="SEMANTIC LAYER" accent="dbt">
                  {SEMANTIC_OPTIONS.map((s) => (
                    <Choice key={s.id} active={s.id === semantic} onClick={() => setSemantic(s.id)} accent="dbt">{s.label}</Choice>
                  ))}
                </Field>
                <Field label="ORCHESTRATION" accent="dbt">
                  {SCHEDULE_OPTIONS.map((s) => (
                    <Choice key={s.id} active={s.id === schedule} onClick={() => setSchedule(s.id)} accent="dbt">{s.label}</Choice>
                  ))}
                </Field>
              </div>
            </section>
          </div>

          {/* ── Spec sheet (printable) ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between mb-3 no-print">
              <span className="eyebrow">Live spec sheet</span>
              <button
                onClick={() => window.print()}
                className="rounded-md bg-ink text-white px-4 py-2 text-xs font-medium hover:bg-graphite transition-colors"
              >
                Print / Save as PDF
              </button>
            </div>

            <div className="print-sheet card p-6">
              <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
                <div>
                  <p className="display text-lg font-semibold text-ink">Pipeline specification</p>
                  <p className="font-mono text-[10px] text-mute tracking-[0.15em] mt-0.5">FIVETRAN → {dest.toUpperCase()} → DBT</p>
                </div>
                <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="12" cy="16" r="8" fill="none" stroke="#2b6ef2" strokeWidth="2" />
                  <circle cx="20" cy="16" r="8" fill="none" stroke="#ff5c39" strokeWidth="2" />
                  <rect x="15" y="9.5" width="2" height="13" rx="1" fill="#0f9e8e" />
                </svg>
              </div>

              {/* Fivetran block */}
              <div className="mb-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ft mb-2">FIVETRAN · MOVE</p>
                <dl className="text-sm divide-y divide-line">
                  <SpecRow k="Source" v={`${connector} (${cat.label})`} />
                  <SpecRow k="Extraction" v={cat.method} />
                  <SpecRow k="Destination" v={dest} />
                  <SpecRow k="Deployment" v={deployMode.label} />
                  <SpecRow k="Data plane" v={deployMode.plane} />
                  <SpecRow k="Networking" v={netLabel} />
                  <SpecRow k="Column policy" v={colLabel} />
                  <SpecRow k="Sync frequency" v={freq} />
                </dl>
              </div>

              {/* Seam */}
              <div className="rounded border border-seam/40 bg-seamsoft/50 px-3 py-2 mb-5">
                <p className="text-xs text-seamdeep leading-relaxed">
                  <span className="font-mono text-[10px] tracking-[0.15em]">THE SEAM&nbsp;</span>
                  Fivetran lands raw tables in {dest}. dbt declares them as <span className="font-mono">source()</span> and runs its SQL there.
                </p>
              </div>

              {/* dbt block */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-dbt mb-2">DBT · TRANSFORM</p>
                <dl className="text-sm divide-y divide-line">
                  <SpecRow k="Sources" v={`${connector} raw schema → source()`} />
                  <SpecRow k="Staging" v="one cleaned, typed model per source table" />
                  <SpecRow k="Mart materialization" v={`${matObj.label} — ${matObj.note}`} />
                  <SpecRow k="Tests" v={tests.length ? tests.join(", ") : "none selected"} />
                  <SpecRow k="Semantic layer" v={semObj.label} />
                  <SpecRow k="Orchestration" v={schedObj.label} />
                </dl>
              </div>

              <p className="text-[11px] text-mute leading-relaxed border-t border-line mt-5 pt-3">
                Generated by Rosetta — Fivetran + dbt enablement field guide. Illustrative configuration, not a provisioning artifact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 py-2">
      <dt className="text-mute">{k}</dt>
      <dd className="text-ink font-medium">{v}</dd>
    </div>
  );
}
