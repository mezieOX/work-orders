import { describe, expect, it } from "vitest";
import { createWorkOrderSchema, updateWorkOrderSchema } from "@/lib/schemas";

describe("createWorkOrderSchema", () => {
  it("accepts a valid create payload", () => {
    const result = createWorkOrderSchema.safeParse({
      title: "Replace belt",
      description: "Line 2 conveyor belt slipped.",
      priority: "High",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a title that is too short", () => {
    const result = createWorkOrderSchema.safeParse({
      title: "A",
      description: "Too short title",
      priority: "Low",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const titleIssue = result.error.issues.find((issue) =>
        issue.path.includes("title"),
      );
      expect(titleIssue).toBeDefined();
    }
  });
});

describe("updateWorkOrderSchema", () => {
  it("requires a valid status", () => {
    const result = updateWorkOrderSchema.safeParse({
      title: "Replace belt",
      description: "Done on site",
      priority: "Medium",
      status: "Finished",
    });

    expect(result.success).toBe(false);
  });
});
