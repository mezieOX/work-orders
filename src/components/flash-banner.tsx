"use client";

import { useSearchParams } from "next/navigation";

/** Lightweight success banners driven by URL query params after redirects. */
export function FlashBanner() {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const deleted = searchParams.get("deleted");

  if (!saved && !deleted) return null;

  const message = deleted
    ? "Work order deleted."
    : "Work order saved successfully.";

  return (
    <div className="banner-success animate-banner mb-2" role="status">
      {message}
    </div>
  );
}
