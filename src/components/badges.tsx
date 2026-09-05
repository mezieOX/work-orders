import type { Priority, Status } from "@/lib/types";

const statusStyles: Record<Status, string> = {
  Open: "bg-[var(--status-open-bg)] text-[var(--status-open)]",
  "In Progress": "bg-[var(--status-progress-bg)] text-[var(--status-progress)]",
  Done: "bg-[var(--status-done-bg)] text-[var(--status-done)]",
};

const priorityStyles: Record<Priority, string> = {
  Low: "text-[var(--ink-muted)]",
  Medium: "text-[var(--accent-deep)]",
  High: "text-[var(--priority-high)]",
};

export function StatusBadge({ status }: { status: Status }) {
  const isLive = status === "In Progress";

  return (
    <span
      className={`animate-badge inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      <span
        className={`size-1.5 rounded-sm bg-current opacity-80 ${isLive ? "status-dot-live" : ""}`}
        aria-hidden
      />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`text-sm font-semibold tabular-nums tracking-wide ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}
