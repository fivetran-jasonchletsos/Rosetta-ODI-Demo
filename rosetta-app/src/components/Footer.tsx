export default function Footer() {
  return (
    <footer className="no-print border-t border-line px-5 pt-12 pb-10 sm:px-6 md:px-16 bg-paper">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between mb-10">
          <div className="max-w-md">
            <p className="eyebrow mb-3">Rosetta · Fivetran + dbt enablement</p>
            <p className="display text-2xl font-medium text-ink leading-snug">
              One pipeline, two fluencies.
            </p>
            <p className="text-sm text-graphite/80 mt-3 leading-relaxed">
              Fivetran moves the data in. dbt models and tests it. The warehouse is the handshake.
              An internal field guide for understanding both halves of the combined platform.
            </p>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <a href="https://github.com/fivetran-jasonchletsos/Rosetta-ODI-Demo" target="_blank" rel="noopener noreferrer"
               className="font-mono text-[11px] tracking-[0.1em] text-mute hover:text-ft transition-colors">GitHub</a>
            <a href="https://www.fivetran.com" target="_blank" rel="noopener noreferrer"
               className="font-mono text-[11px] tracking-[0.1em] text-mute hover:text-ft transition-colors">Fivetran</a>
            <a href="https://www.getdbt.com" target="_blank" rel="noopener noreferrer"
               className="font-mono text-[11px] tracking-[0.1em] text-mute hover:text-dbt transition-colors">dbt Labs</a>
            <a href="https://docs.getdbt.com" target="_blank" rel="noopener noreferrer"
               className="font-mono text-[11px] tracking-[0.1em] text-mute hover:text-dbt transition-colors">dbt docs</a>
          </nav>
        </div>
        <div className="rule" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-[0.15em] text-mute/80">
              Fivetran (move) + Snowflake / Databricks / BigQuery + dbt (transform + test)
            </p>
            <p className="font-mono text-[10px] tracking-[0.15em] text-mute/60">
              Set in Space Grotesk, Inter, JetBrains Mono
            </p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.15em] text-mute/60 text-right">2026 · Fivetran SE artifact</p>
        </div>
      </div>
    </footer>
  );
}
