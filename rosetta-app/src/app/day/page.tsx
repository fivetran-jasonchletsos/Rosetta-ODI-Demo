import { DAY, MYTHS } from "@/lib/content";

export const metadata = { title: "Day in the life — Rosetta" };

export default function DayPage() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 reveal reveal-1">
          <p className="eyebrow mb-3">Two crafts, one road</p>
          <h1 className="display text-4xl sm:text-5xl font-semibold text-ink leading-tight">Day in the life</h1>
          <p className="text-lg text-graphite/90 mt-4 max-w-2xl leading-relaxed">
            A Fivetran admin and an analytics engineer have different identities and different tools. Here is the
            same workday from both sides — and the moments where they hand off to each other.
          </p>
        </header>

        {/* Column headers */}
        <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr_1fr] gap-3 mb-3 reveal reveal-2">
          <div className="hidden md:block" />
          <div className="flex items-center gap-2"><span className="dot dot--ft" /><span className="font-mono text-[11px] tracking-[0.15em] text-ft">FIVETRAN ADMIN</span></div>
          <div className="flex items-center gap-2"><span className="dot dot--dbt" /><span className="font-mono text-[11px] tracking-[0.15em] text-dbt">ANALYTICS ENGINEER</span></div>
        </div>

        <div className="space-y-3 mb-16">
          {DAY.map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[10rem_1fr_1fr] gap-3 reveal reveal-3">
              <div className="md:pt-4">
                <span className="font-mono text-[10px] text-mute md:hidden">MOMENT</span>
                <p className="display text-sm font-semibold text-ink">{row.moment}</p>
              </div>
              <div className="card bar-ft p-4">
                <p className="text-sm text-graphite/90 leading-relaxed">{row.ft}</p>
              </div>
              <div className="card bar-dbt p-4">
                <p className="text-sm text-graphite/90 leading-relaxed">{row.dbt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Myths */}
        <section>
          <h2 className="display text-2xl font-semibold text-ink mb-5">Myths worth retiring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MYTHS.map((m, i) => {
              const isFt = m.audience === "Fivetran people";
              return (
                <div key={i} className={`card p-5 ${isFt ? "bar-ft" : "bar-dbt"}`}>
                  <p className={`font-mono text-[10px] tracking-[0.15em] mb-2 ${isFt ? "text-ft" : "text-dbt"}`}>
                    {m.audience.toUpperCase()} OFTEN THINK
                  </p>
                  <p className="display text-base font-medium text-ink mb-2">{m.myth}</p>
                  <p className="text-sm text-graphite/85 leading-relaxed">{m.truth}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
