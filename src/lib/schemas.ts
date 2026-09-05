import { z } from "zod";
import { PRIORITIES, STATUSES } from "./types";

/**
 * Server-side validation schemas.
 * Client forms mirror these rules for UX, but the API is the source of truth.
 */

export const createWorkOrderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(80, "Title must be 80 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2,000 characters or fewer"),
  priority: z.enum(PRIORITIES, {
    error: "Priority must be Low, Medium, or High",
  }),
});

export const updateWorkOrderSchema = createWorkOrderSchema.extend({
  status: z.enum(STATUSES, {
    error: "Status must be Open, In Progress, or Done",
  }),
});

export type CreateWorkOrderSchema = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderSchema = z.infer<typeof updateWorkOrderSchema>;

/** Turn a Zod failure into field → message[] for form UIs. */
export function toFieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors;
}
