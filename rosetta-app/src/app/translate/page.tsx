"use client";

import { useMemo, useState } from "react";
import { TERMS } from "@/lib/content";

type Lead = "ft" | "dbt";

export default function TranslatePage() {
  const [lead, setLead] = useState<Lead>("ft");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return TERMS;
    return TERMS.filter(
      (t) =>
        t.ft.toLowerCase().includes(needle) ||
        t.dbt.toLowerCase().includes(needle) ||
        t.note.toLowerCase().includes(needle),
    );
  }, [q]);

  const leadIsFt = lead === "ft";

  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="eyebrow mb-3">Terminology Rosetta</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold text-ink leading-tight">Translation table</h1>
          <p className="text-lg text-graphite/90 mt-4 max-w-2xl leading-relaxed">
            {TERMS.length} pairs. The third column is where the teaching happens — it flags where a concept genuinely
            does <em>not</em> map cleanly, not just synonyms.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="inline-flex rounded-full border border-line bg-panel p-0.5 self-start">
            <button
              onClick={() => setLead("ft")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${leadIsFt ? "bg-ft text-white" : "text-graphite hover:text-ink"}`}
            >I speak Fivetran</button>
            <button
              onClick={() => setLead("dbt")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!leadIsFt ? "bg-dbt text-white" : "text-graphite hover:text-ink"}`}
            >I speak dbt</button>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms…"
            className="flex-1 rounded-md border border-line bg-panel px-3.5 py-2 text-sm text-ink placeholder:text-mute/70 focus:outline-none focus:border-ft"
          />
        </div>

        <div className="space-y-3">
          {rows.map((t) => {
            const left = leadIsFt ? t.ft : t.dbt;
            const right = leadIsFt ? t.dbt : t.ft;
            const leftAccent = leadIsFt ? "text-ft" : "text-dbt";
            const rightAccent = leadIsFt ? "text-dbt" : "text-ft";
            const leftLabel = leadIsFt ? "FIVETRAN" : "DBT";
            const rightLabel = leadIsFt ? "DBT" : "FIVETRAN";
            return (
              <div key={t.ft} className="card p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-3">
                  <div>
                    <p className={`font-mono text-[10px] tracking-[0.15em] mb-1 ${leftAccent}`}>{leftLabel}</p>
                    <p className="font-mono text-sm text-ink">{left}</p>
                  </div>
                  <div className="md:border-l md:border-line md:pl-5">
                    <p className={`font-mono text-[10px] tracking-[0.15em] mb-1 ${rightAccent}`}>{rightLabel}</p>
                    <p className="font-mono text-sm text-ink">{right}</p>
                  </div>
                </div>
                <p className="text-sm text-graphite/85 leading-relaxed border-t border-line pt-3">{t.note}</p>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="text-sm text-mute py-8 text-center">No terms match &ldquo;{q}&rdquo;.</p>
          )}
        </div>
      </div>
    </main>
  );
}
