import type { Metadata } from "next";
import Link from "next/link";
import { WorkOrderForm } from "@/components/work-order-form";

export const metadata: Metadata = {
  title: "New work order",
};

export default function NewWorkOrderPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <div className="space-y-3">
        <Link
          href="/"
          className="animate-slide-in inline-flex text-sm font-semibold text-[var(--accent-deep)] underline-offset-4 transition-transform hover:-translate-x-0.5 hover:underline"
        >
          ← Back to list
        </Link>
        <h1 className="headline-clip font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="headline-reveal">New work order</span>
        </h1>
        <p className="animate-rise delay-2 text-[var(--ink-muted)]">
          Capture the job clearly. Status starts as Open — you can change it
          later when editing.
        </p>
      </div>

      <div className="animate-rise-spring delay-3">
        <WorkOrderForm mode="create" />
      </div>
    </div>
  );
}
