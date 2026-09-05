import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateWorkOrderInput,
  Status,
  UpdateWorkOrderInput,
  WorkOrder,
} from "./types";

/**
 * Tiny file-based persistence layer.
 * Reads/writes data/work-orders.json — no database required.
 *
 * NOTE: This module uses Node `fs`, so it must only run on the server
 * (Route Handlers, Server Components, scripts). Never import it in Client Components.
 */

const DATA_PATH = path.join(process.cwd(), "data", "work-orders.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, "[]\n", "utf8");
  }
}

async function readAll(): Promise<WorkOrder[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as WorkOrder[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(orders: WorkOrder[]): Promise<void> {
  await ensureDataFile();
  // Pretty-print so the JSON file stays reviewable in git / demos
  await fs.writeFile(DATA_PATH, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

/** Newest updates first — matches how technicians usually scan a queue. */
function sortByUpdatedAtDesc(orders: WorkOrder[]): WorkOrder[] {
  return [...orders].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export type ListFilters = {
  /** Status filter (chosen over text search to keep the assessment scope tight). */
  status?: Status | "All";
};

export async function listWorkOrders(
  filters: ListFilters = {},
): Promise<WorkOrder[]> {
  const orders = await readAll();
  const filtered =
    !filters.status || filters.status === "All"
      ? orders
      : orders.filter((order) => order.status === filters.status);

  return sortByUpdatedAtDesc(filtered);
}

export async function getWorkOrderById(
  id: string,
): Promise<WorkOrder | undefined> {
  const orders = await readAll();
  return orders.find((order) => order.id === id);
}

export async function createWorkOrder(
  input: CreateWorkOrderInput,
): Promise<WorkOrder> {
  const orders = await readAll();
  const now = new Date().toISOString();

  const created: WorkOrder = {
    id: uuidv4(),
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "Open",
    updatedAt: now,
  };

  orders.push(created);
  await writeAll(orders);
  return created;
}

export async function updateWorkOrder(
  id: string,
  input: UpdateWorkOrderInput,
): Promise<WorkOrder | null> {
  const orders = await readAll();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;

  const updated: WorkOrder = {
    ...orders[index],
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: input.status,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updated;
  await writeAll(orders);
  return updated;
}

export async function deleteWorkOrder(id: string): Promise<boolean> {
  const orders = await readAll();
  const next = orders.filter((order) => order.id !== id);
  if (next.length === orders.length) return false;
  await writeAll(next);
  return true;
}
