import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkOrderForm } from "@/components/work-order-form";
import { getWorkOrderById } from "@/lib/work-orders";

export const dynamic = "force-dynamic";

type EditProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getWorkOrderById(id);
  return { title: order ? `Edit · ${order.title}` : "Edit work order" };
}

export default async function EditWorkOrderPage({ params }: EditProps) {
  const { id } = await params;
  const order = await getWorkOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <div className="space-y-3">
        <Link
          href={`/work-orders/${order.id}`}
          className="animate-slide-in inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-4 transition-transform hover:-translate-x-0.5 hover:underline"
        >
          ← Back to detail
        </Link>
        <h1 className="headline-clip font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="headline-reveal">Edit work order</span>
        </h1>
        <p className="animate-rise delay-2 text-[var(--ink-muted)]">
          Update details, priority, or status. Changes save to the shared JSON
          file immediately.
        </p>
      </div>

      <div className="animate-rise-spring delay-3">
        <WorkOrderForm mode="edit" initial={order} />
      </div>
    </div>
  );
}
