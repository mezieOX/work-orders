"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { formatUpdatedAt } from "@/lib/format";
import type { WorkOrder } from "@/lib/types";

type OrderRowProps = {
  order: WorkOrder;
  index: number;
};

/** Whole row is clickable (desktop table + keyboard). */
export function OrderRow({ order, index }: OrderRowProps) {
  const router = useRouter();
  const href = `/work-orders/${order.id}`;

  function open() {
    router.push(href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  }

  return (
    <tr
      className="order-row animate-row-in group cursor-pointer"
      style={{ animationDelay: `${120 + index * 70}ms` }}
      tabIndex={0}
      aria-label={`Open work order: ${order.title}`}
      onClick={open}
      onKeyDown={onKeyDown}
    >
      <td className="table-cell table-cell-title">
        {/* Keep a real link for middle-click / open-in-new-tab / crawlers */}
        <Link
          href={href}
          className="order-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          title={order.title}
          onClick={(event) => event.stopPropagation()}
        >
          {order.title}
        </Link>
      </td>
      <td className="table-cell">
        <PriorityBadge priority={order.priority} />
      </td>
      <td className="table-cell">
        <StatusBadge status={order.status} />
      </td>
      <td className="table-cell text-[var(--ink-muted)]">
        <time dateTime={order.updatedAt}>
          {formatUpdatedAt(order.updatedAt)}
        </time>
      </td>
    </tr>
  );
}
