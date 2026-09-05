import Link from "next/link";
import { OrderRow } from "@/components/order-row";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { formatUpdatedAt } from "@/lib/format";
import type { WorkOrder } from "@/lib/types";

type WorkOrderTableProps = {
  orders: WorkOrder[];
};

export function WorkOrderTable({ orders }: WorkOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="surface-panel animate-rise-spring px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--accent-soft)]/50">
          <span
            className="block size-2.5 rounded-sm bg-[var(--accent)] animate-[pulse-dot_1.4s_ease-in-out_infinite]"
            aria-hidden
          />
        </div>
        <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          No work orders match this filter
        </p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Try another status, or create a new order to get started.
        </p>
        <Link href="/work-orders/new" className="btn-primary mt-7 inline-flex">
          New work order
        </Link>
      </div>
    );
  }

  return (
    <div className="surface-panel animate-rise-spring delay-3 overflow-hidden">
      <div className="hidden md:block">
        <table className="orders-table">
          <colgroup>
            <col style={{ width: "44%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--surface-soft)]/70">
              <th scope="col" className="table-head">
                Title
              </th>
              <th scope="col" className="table-head">
                Priority
              </th>
              <th scope="col" className="table-head">
                Status
              </th>
              <th scope="col" className="table-head">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <OrderRow key={order.id} order={order} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[var(--line)] md:hidden">
        {orders.map((order, index) => (
          <li
            key={order.id}
            className="animate-row-in px-4 py-4"
            style={{ animationDelay: `${120 + index * 70}ms` }}
          >
            <Link
              href={`/work-orders/${order.id}`}
              className="block space-y-3 rounded-[8px] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <p className="font-semibold text-[var(--ink)]">{order.title}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <PriorityBadge priority={order.priority} />
                <StatusBadge status={order.status} />
                <time
                  dateTime={order.updatedAt}
                  className="text-[var(--ink-muted)]"
                >
                  {formatUpdatedAt(order.updatedAt)}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
