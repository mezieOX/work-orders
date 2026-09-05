"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUSES, type Status } from "@/lib/types";

/**
 * Animated chip filter — updates ?status= so the Server Component list re-renders.
 */
export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "All";

  function onSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  const options: Array<"All" | Status> = ["All", ...STATUSES];

  return (
    <div
      className="animate-rise-spring delay-2 flex flex-col gap-2"
      role="group"
      aria-label="Filter work orders by status"
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        Filter by status
      </p>
      <div className="filter-rail">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="filter-chip"
            aria-pressed={current === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
