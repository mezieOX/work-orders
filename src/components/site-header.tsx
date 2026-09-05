import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header relative z-10 sticky top-0">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span className="brand-mark font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--ink)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-2xl">
            ForgeDesk
          </span>
          <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:inline">
            Work Orders
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
          <Link href="/" className="btn-ghost text-sm">
            All orders
          </Link>
          <Link href="/work-orders/new" className="btn-primary text-sm">
            New order
          </Link>
        </nav>
      </div>
    </header>
  );
}
