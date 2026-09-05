import { NextResponse } from "next/server";
import { createWorkOrderSchema, toFieldErrors } from "@/lib/schemas";
import { createWorkOrder, listWorkOrders } from "@/lib/work-orders";
import { STATUSES, type Status } from "@/lib/types";

/**
 * Always serve fresh data from the JSON file.
 * File-backed storage changes outside Next's cache, so we opt out of caching.
 */
export const dynamic = "force-dynamic";

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

/** GET /api/work-orders?status=Open */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");

  const status =
    statusParam && statusParam !== "All" && isStatus(statusParam)
      ? statusParam
      : "All";

  const orders = await listWorkOrders({ status });
  return NextResponse.json(orders, {
    headers: { "Cache-Control": "no-store" },
  });
}

/** POST /api/work-orders — create with default status Open */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", fieldErrors: {} },
      { status: 400 },
    );
  }

  const parsed = createWorkOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: toFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const created = await createWorkOrder(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
