/**
 * Shared domain types for Work Orders.
 * Kept in one place so the API, data module, and UI stay aligned.
 */

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = ["Open", "In Progress", "Done"] as const;
export type Status = (typeof STATUSES)[number];

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  /** ISO-8601 timestamp; bumped on every write */
  updatedAt: string;
};

/** Payload accepted when creating a work order (status defaults to Open). */
export type CreateWorkOrderInput = {
  title: string;
  description: string;
  priority: Priority;
};

/** Payload accepted when updating an existing work order. */
export type UpdateWorkOrderInput = {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
};

/** Field-level validation errors returned to forms. */
export type FieldErrors = Partial<
  Record<"title" | "description" | "priority" | "status", string[]>
>;
