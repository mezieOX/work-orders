import { Suspense } from "react";
import { FlashBanner } from "@/components/flash-banner";
import { StatusFilter } from "@/components/status-filter";
import { WorkOrderTable } from "@/components/work-order-table";
import { listWorkOrders } from "@/lib/work-orders";
import { STATUSES, type Status } from "@/lib/types";
import Link from "next/link";

/**
 * List page — Server Component.
 * Reads JSON via the data module (not the client) and filters by ?status=.
 */
export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ status?: string }>;
};

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const status =
    params.status && isStatus(params.status) ? params.status : "All";

  const orders = await listWorkOrders({ status });

  return (
    <div className="space-y-9">
      <section className="relative space-y-4">
        <p className="eyebrow animate-slide-in">
          <span className="eyebrow-dot" aria-hidden />
          Technician queue
        </p>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <h1 className="headline-clip font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              <span className="headline-reveal">Work orders</span>
            </h1>
            <p className="animate-rise delay-2 max-w-md text-[1.05rem] leading-relaxed text-[var(--ink-muted)]">
              Track open jobs, update progress, and keep the queue tidy — one
              clear list, no clutter.
            </p>
          </div>
          <Link
            href="/work-orders/new"
            className="btn-primary animate-rise-spring delay-3 shrink-0"
          >
            New work order
          </Link>
        </div>
      </section>

      <Suspense fallback={null}>
        <FlashBanner />
      </Suspense>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Suspense
          fallback={
            <div className="h-12 w-64 animate-pulse rounded-[8px] bg-[var(--surface-soft)]" />
          }
        >
          <StatusFilter />
        </Suspense>
        <p className="stat-pill animate-rise delay-4">
          Showing{" "}
          <strong className="animate-count" key={orders.length}>
            {orders.length}
          </strong>{" "}
          {orders.length === 1 ? "order" : "orders"}
          {status !== "All" ? ` · ${status}` : ""}
        </p>
      </section>

      <WorkOrderTable orders={orders} />
    </div>
  );
}
