/**
 * Integration-style unit test for the JSON persistence module.
 * Uses a temporary data directory so we never touch the real seed file.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

describe("work-orders data module", () => {
  let tempDir: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "wo-"));
    // The data module resolves data/ relative to process.cwd()
    process.chdir(tempDir);
    vi.resetModules();
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("creates a work order and lists it", async () => {
    const {
      createWorkOrder,
      listWorkOrders,
    } = await import("@/lib/work-orders");

    const created = await createWorkOrder({
      title: "Calibrate sensor",
      description: "Photo-eye on aisle B",
      priority: "Medium",
    });

    expect(created.id).toBeTruthy();
    expect(created.status).toBe("Open");

    const listed = await listWorkOrders();
    expect(listed).toHaveLength(1);
    expect(listed[0].title).toBe("Calibrate sensor");
  });
});
