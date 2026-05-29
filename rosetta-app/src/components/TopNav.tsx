"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { num: "01", href: "/",             label: "Pipeline" },
  { num: "02", href: "/fivetran",     label: "Fivetran" },
  { num: "03", href: "/dbt",          label: "dbt" },
  { num: "04", href: "/builder",      label: "Builder" },
  { num: "05", href: "/translate",    label: "Translate" },
  { num: "06", href: "/metrics",      label: "Metrics" },
  { num: "07", href: "/day",          label: "Day in the Life" },
  { num: "08", href: "/architecture", label: "ODI" },
];

export default function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="meta-bar no-print">
      <div className="mx-auto flex max-w-7xl items-center gap-x-5 gap-y-2 px-4 py-3 overflow-x-auto sm:px-6 sm:py-4 md:px-10">
        <Link href="/" className="flex-none flex items-center gap-2.5 text-ink hover:text-ft focus:outline-none">
          <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" className="flex-none">
            {/* two interlocking marks — Fivetran blue + dbt coral meeting at a teal seam */}
            <circle cx="12" cy="16" r="8" fill="none" stroke="#2b6ef2" strokeWidth="2" />
            <circle cx="20" cy="16" r="8" fill="none" stroke="#ff5c39" strokeWidth="2" />
            <rect x="15" y="9.5" width="2" height="13" rx="1" fill="#0f9e8e" />
          </svg>
          <span className="display text-base sm:text-lg font-semibold leading-none">Rosetta</span>
          <span className="hidden sm:inline font-mono text-[10px] text-mute leading-none tracking-[0.2em]">FIVETRAN · DBT</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-1 flex-nowrap items-center gap-x-4 sm:gap-x-5">
          {NAV.map((n) => {
            const a = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="group flex flex-none items-baseline gap-1.5 focus:outline-none"
                aria-current={a ? "page" : undefined}
              >
                <span className={`font-mono text-[10px] tracking-[0.2em] ${a ? "text-ft" : "text-mute/60"}`}>{n.num}</span>
                <span className={`text-sm sm:text-[15px] transition-colors ${a ? "nav-active text-ink font-medium" : "text-graphite/70 group-hover:text-ink"}`}>
                  {n.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
