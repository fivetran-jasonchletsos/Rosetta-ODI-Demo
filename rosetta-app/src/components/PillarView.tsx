import { type Pillar, type Owner, OWNER_STYLE } from "@/lib/content";

export default function PillarView({
  eyebrow,
  title,
  lede,
  pillars,
  side,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  pillars: Pillar[];
  side: Owner;
}) {
  const a = OWNER_STYLE[side];
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 reveal reveal-1">
          <p className={`eyebrow mb-3 ${a.text}`}>{eyebrow}</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold text-ink leading-tight max-w-3xl">{title}</h1>
          <p className="text-lg text-graphite/90 mt-4 max-w-2xl leading-relaxed">{lede}</p>
        </header>

        <div className="space-y-5">
          {pillars.map((p, i) => {
            const pa = OWNER_STYLE[p.owner];
            return (
              <section key={p.key} className={`card ${pa.bar} p-6 reveal reveal-${Math.min(i + 1, 5)}`}>
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="display text-xl sm:text-2xl font-semibold text-ink">{p.title}</h2>
                  {p.owner === "seam" && <span className={`pill ${pa.pill}`}>Shared</span>}
                </div>

                <p className="text-graphite leading-relaxed mb-4 max-w-3xl">{p.body}</p>

                <div className={`rounded border border-line ${pa.soft} p-3.5 mb-4 max-w-3xl`}>
                  <p className={`font-mono text-[10px] tracking-[0.15em] mb-1 ${pa.text}`}>WHY THE OTHER SIDE SHOULD CARE</p>
                  <p className="text-sm text-ink leading-relaxed">{p.why}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {p.nodes.map((n) => (
                    <span key={n} className="pill">{n}</span>
                  ))}
                </div>

                {p.flag && (
                  <p className="text-xs text-mute leading-relaxed border-t border-line pt-3 max-w-3xl">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-mute/80">NOTE&nbsp;&nbsp;</span>
                    {p.flag}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
