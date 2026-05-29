"use client";

import { useState } from "react";
import { STAGES, OWNER_LABEL, type Owner } from "@/lib/content";

const ownerClasses: Record<Owner, { bar: string; pill: string; text: string; ring: string }> = {
  ft:   { bar: "bar-ft",   pill: "pill--ft",   text: "text-ft",   ring: "text-ft" },
  dbt:  { bar: "bar-dbt",  pill: "pill--dbt",  text: "text-dbt",  ring: "text-dbt" },
  seam: { bar: "bar-seam", pill: "pill--seam", text: "text-seam", ring: "text-seam" },
};

type Audience = "ft" | "dbt";

export default function PipelineDiagram() {
  const [selected, setSelected] = useState<string>("warehouse");
  const [audience, setAudience] = useState<Audience>("ft");
  const stage = STAGES.find((s) => s.id === selected) ?? STAGES[0];
  const oc = ownerClasses[stage.owner];

  return (
    <div className="no-print">
      {/* Audience toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="dot dot--ft" /> Fivetran</span>
          <span className="flex items-center gap-1.5"><span className="dot dot--seam" /> Shared</span>
          <span className="flex items-center gap-1.5"><span className="dot dot--dbt" /> dbt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="eyebrow">I'm coming from</span>
          <div className="inline-flex rounded-full border border-line bg-panel p-0.5">
            <button
              onClick={() => setAudience("ft")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${audience === "ft" ? "bg-ft text-white" : "text-graphite hover:text-ink"}`}
            >Fivetran</button>
            <button
              onClick={() => setAudience("dbt")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${audience === "dbt" ? "bg-dbt text-white" : "text-graphite hover:text-ink"}`}
            >dbt</button>
          </div>
        </div>
      </div>

      {/* Stage row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-6">
        {STAGES.map((s, i) => {
          const c = ownerClasses[s.owner];
          const active = s.id === selected;
          const yourSide = s.owner === audience || s.owner === "seam";
          return (
            <button
              key={s.id}
              aria-pressed={active}
              onClick={() => setSelected(s.id)}
              className={`stage card ${c.bar} ${c.ring} p-3.5 text-left ${active ? "" : "lift"} ${yourSide ? "" : "opacity-60"}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className={`dot dot--${s.owner}`} />
              </div>
              <p className="display text-[15px] font-semibold text-ink leading-tight">{s.title}</p>
              <p className={`font-mono text-[10px] mt-0.5 ${c.text}`}>{s.verb}</p>
            </button>
          );
        })}
      </div>

      {/* Flow arrow legend */}
      <div className="hidden md:flex items-center justify-center gap-2 mt-3 text-mute font-mono text-[10px]">
        <span className="text-ft">extract + load</span>
        <span className="flex-1 border-t border-dashed border-line max-w-[8rem]" />
        <span className="text-seam">the seam — the warehouse</span>
        <span className="flex-1 border-t border-dashed border-line max-w-[8rem]" />
        <span className="text-dbt">transform + test + govern</span>
      </div>

      {/* Detail panel */}
      <div className={`card ${oc.bar} mt-5 p-6 reveal`} key={stage.id}>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className={`pill ${oc.pill}`}>{OWNER_LABEL[stage.owner]}</span>
          <h3 className="display text-2xl font-semibold text-ink">{stage.title}</h3>
        </div>
        <p className="text-graphite leading-relaxed mb-4 max-w-2xl">{stage.blurb}</p>
        <ul className="space-y-2 mb-5 max-w-2xl">
          {stage.detail.map((d, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-graphite/90 leading-relaxed">
              <span className={`mt-1.5 flex-none w-1.5 h-1.5 rounded-full ${stage.owner === "ft" ? "bg-ft" : stage.owner === "dbt" ? "bg-dbt" : "bg-seam"}`} />
              {d}
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          <div className="rounded border border-line bg-ftsoft/60 p-3">
            <p className="font-mono text-[10px] tracking-[0.15em] text-ft mb-1">FIVETRAN CALLS IT</p>
            <p className="text-sm text-ink font-medium">{stage.ftTerm}</p>
          </div>
          <div className="rounded border border-line bg-dbtsoft/60 p-3">
            <p className="font-mono text-[10px] tracking-[0.15em] text-dbt mb-1">DBT CALLS IT</p>
            <p className="text-sm text-ink font-medium">{stage.dbtTerm}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
