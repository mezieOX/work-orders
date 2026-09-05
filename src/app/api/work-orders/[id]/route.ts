import { NextResponse } from "next/server";
import { toFieldErrors, updateWorkOrderSchema } from "@/lib/schemas";
import {
  deleteWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
} from "@/lib/work-orders";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /api/work-orders/:id */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const order = await getWorkOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  return NextResponse.json(order, {
    headers: { "Cache-Control": "no-store" },
  });
}

/** PUT /api/work-orders/:id */
export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", fieldErrors: {} },
      { status: 400 },
    );
  }

  const parsed = updateWorkOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fieldErrors: toFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const updated = await updateWorkOrder(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

/** DELETE /api/work-orders/:id */
export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteWorkOrder(id);

  if (!deleted) {
    return NextResponse.json({ error: "Work order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
