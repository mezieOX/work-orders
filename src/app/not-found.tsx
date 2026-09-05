import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-panel mx-auto max-w-lg animate-rise px-6 py-12 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
        Work order not found
      </h1>
      <p className="mt-2 text-[var(--ink-muted)]">
        It may have been deleted, or the link is incorrect.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Back to list
      </Link>
    </div>
  );
}
