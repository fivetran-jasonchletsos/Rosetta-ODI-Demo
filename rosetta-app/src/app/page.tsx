import Link from "next/link";
import PipelineDiagram from "@/components/PipelineDiagram";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const TABS = [
  { href: "/fivetran", num: "02", title: "Fivetran, explained", desc: "Connectors, destinations, activations, deployment and security modes, MAR. For dbt people.", accent: "bar-ft" },
  { href: "/dbt", num: "03", title: "dbt, explained", desc: "Core, Cloud and Fusion, models and tests, the semantic layer, orchestration. For Fivetran people.", accent: "bar-dbt" },
  { href: "/builder", num: "04", title: "Config builder", desc: "Pick a source, destination, deployment and security mode, then the dbt half. Export the spec to PDF.", accent: "bar-seam" },
  { href: "/translate", num: "05", title: "Translation table", desc: "Fourteen term pairs mapping a Fivetran concept to its dbt analog — and where the boundary really is.", accent: "bar-ft" },
  { href: "/metrics", num: "06", title: "Metrics dashboard", desc: "The guide by the numbers — rendered from the gold marts and the dbt semantic layer. Charts on par with the architecture.", accent: "bar-seam" },
  { href: "/day", num: "07", title: "Day in the life", desc: "Side-by-side: what a Fivetran admin's day looks like next to an analytics engineer's, and where they hand off.", accent: "bar-dbt" },
  { href: "/architecture", num: "08", title: "How this is built", desc: "This app is itself an ODI demo — Fivetran lands the data, dbt models it, the front end reads gold.", accent: "bar-seam" },
];

export default function Home() {
  return (
    <main className="px-5 py-12 sm:px-6 sm:py-16 md:px-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 reveal reveal-1">
          <p className="eyebrow mb-4">Fivetran + dbt · internal field guide</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl font-semibold text-ink leading-[1.05] max-w-3xl">
            The same pipeline, read in two fluencies.
          </h1>
          <p className="text-lg text-graphite/90 mt-5 max-w-2xl leading-relaxed">
            Fivetran moves data in. dbt models, tests, and governs it. The warehouse is where they shake hands.
            This guide helps each side understand the other&apos;s half of the combined platform — without
            an acquirer-and-acquired framing. Two specialties, one road.
          </p>
        </header>

        <section className="mb-16 reveal reveal-2">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="display text-2xl font-semibold text-ink">The combined pipeline</h2>
            <span className="eyebrow hidden sm:inline">click a stage</span>
          </div>
          <PipelineDiagram />
        </section>

        <section className="mb-16 reveal reveal-3">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="display text-2xl font-semibold text-ink">The guide in two minutes</h2>
            <span className="eyebrow hidden sm:inline">walkthrough</span>
          </div>
          <video
            className="w-full rounded-lg border border-line bg-black no-print"
            controls
            preload="metadata"
            playsInline
            poster={`${BASE}/video/poster.png`}
          >
            <source src={`${BASE}/video/walkthrough.mp4`} type="video/mp4" />
            Your browser does not support embedded video.{" "}
            <a href={`${BASE}/video/walkthrough.mp4`}>Download the walkthrough.</a>
          </video>
          <p className="text-sm text-graphite/80 mt-3 leading-relaxed">
            A scroll through every section: the combined pipeline, the Fivetran and dbt halves, the config
            builder, the translation table, the metrics dashboard, day in the life, and how this app itself is built.
          </p>
        </section>

        <section className="reveal reveal-4">
          <h2 className="display text-2xl font-semibold text-ink mb-5">Where to go next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href} className={`card lift ${t.accent} p-5 block`}>
                <span className="font-mono text-[10px] text-mute">{t.num}</span>
                <p className="display text-lg font-semibold text-ink mt-1 mb-1.5">{t.title}</p>
                <p className="text-sm text-graphite/80 leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
