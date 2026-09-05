import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { DeleteButton } from "@/components/delete-button";
import { FlashBanner } from "@/components/flash-banner";
import { formatUpdatedAt } from "@/lib/format";
import { getWorkOrderById } from "@/lib/work-orders";

export const dynamic = "force-dynamic";

type DetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getWorkOrderById(id);
  return { title: order?.title ?? "Work order" };
}

export default async function WorkOrderDetailPage({ params }: DetailProps) {
  const { id } = await params;
  const order = await getWorkOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <div className="space-y-3">
        <Link
          href="/"
          className="animate-slide-in inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-4 transition-transform hover:-translate-x-0.5 hover:underline"
        >
          ← Back to list
        </Link>
        <h1 className="headline-clip font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
          <span className="headline-reveal">{order.title}</span>
        </h1>
      </div>

      <Suspense fallback={null}>
        <FlashBanner />
      </Suspense>

      <article className="surface-panel surface-panel-static animate-rise-spring delay-2 space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-sm text-[var(--ink-muted)]">Priority</span>
          <PriorityBadge priority={order.priority} />
        </div>

        {/* Plain text only — never dangerouslySetInnerHTML */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-[1.08rem] leading-relaxed text-[var(--ink)]">
            {order.description.trim() || "No description provided."}
          </p>
        </div>

        <p className="text-sm text-[var(--ink-muted)]">
          Last updated{" "}
          <time dateTime={order.updatedAt}>
            {formatUpdatedAt(order.updatedAt)}
          </time>
        </p>

        <div className="flex flex-wrap gap-3 border-t border-[var(--line)] pt-6">
          <Link href={`/work-orders/${order.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <DeleteButton id={order.id} title={order.title} />
        </div>
      </article>
    </div>
  );
}
