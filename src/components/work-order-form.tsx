"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";
import {
  PRIORITIES,
  STATUSES,
  type FieldErrors,
  type Priority,
  type Status,
  type WorkOrder,
} from "@/lib/types";

type Mode = "create" | "edit";

type WorkOrderFormProps = {
  mode: Mode;
  initial?: WorkOrder;
};

type FormState = {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
};

export function WorkOrderForm({ mode, initial }: WorkOrderFormProps) {
  const router = useRouter();
  const formId = useId();

  const [values, setValues] = useState<FormState>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    priority: initial?.priority ?? "Medium",
    status: initial?.status ?? "Open",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError(null);
    setFieldErrors({});

    const payload =
      mode === "create"
        ? {
            title: values.title,
            description: values.description,
            priority: values.priority,
          }
        : {
            title: values.title,
            description: values.description,
            priority: values.priority,
            status: values.status,
          };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/work-orders"
          : `/api/work-orders/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as {
        id?: string;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Something went wrong");
        // Move focus to the first invalid field for keyboard / a11y users
        const firstInvalid = Object.keys(data.fieldErrors ?? {})[0];
        if (firstInvalid) {
          document.getElementById(`${formId}-${firstInvalid}`)?.focus();
        }
        return;
      }

      const targetId = mode === "create" ? data.id : initial!.id;
      router.push(`/work-orders/${targetId}?saved=1`);
      router.refresh();
    } catch {
      setFormError("Network error — please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-panel surface-panel-static space-y-6 p-6 sm:p-8"
      noValidate
    >
      {formError ? (
        <div className="banner-error" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor={`${formId}-title`} className="field-label">
          Title
        </label>
        <input
          id={`${formId}-title`}
          name="title"
          type="text"
          required
          maxLength={80}
          value={values.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={
            fieldErrors.title ? `${formId}-title-error` : undefined
          }
          className="field-control"
          placeholder="e.g. Replace HVAC filter — Bay 3"
        />
        {fieldErrors.title ? (
          <p
            id={`${formId}-title-error`}
            className="field-error"
            role="alert"
          >
            {fieldErrors.title[0]}
          </p>
        ) : (
          <p className="field-hint">2–80 characters</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor={`${formId}-description`} className="field-label">
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={6}
          maxLength={2000}
          value={values.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={
            fieldErrors.description
              ? `${formId}-description-error`
              : `${formId}-description-hint`
          }
          className="field-control min-h-[9rem] resize-y"
          placeholder="What needs doing, where, and any constraints…"
        />
        {fieldErrors.description ? (
          <p
            id={`${formId}-description-error`}
            className="field-error"
            role="alert"
          >
            {fieldErrors.description[0]}
          </p>
        ) : (
          <p id={`${formId}-description-hint`} className="field-hint">
            Up to 2,000 characters · {values.description.length} used
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${formId}-priority`} className="field-label">
            Priority
          </label>
          <select
            id={`${formId}-priority`}
            name="priority"
            value={values.priority}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                priority: event.target.value as Priority,
              }))
            }
            aria-invalid={Boolean(fieldErrors.priority)}
            className="field-control"
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {fieldErrors.priority ? (
            <p className="field-error" role="alert">
              {fieldErrors.priority[0]}
            </p>
          ) : null}
        </div>

        {mode === "edit" ? (
          <div className="space-y-2">
            <label htmlFor={`${formId}-status`} className="field-label">
              Status
            </label>
            <select
              id={`${formId}-status`}
              name="status"
              value={values.status}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  status: event.target.value as Status,
                }))
              }
              aria-invalid={Boolean(fieldErrors.status)}
              className="field-control"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {fieldErrors.status ? (
              <p className="field-error" role="alert">
                {fieldErrors.status[0]}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="field-label">Status</p>
            <p className="rounded-[8px] border border-dashed border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2.5 text-sm text-[var(--ink-muted)]">
              New orders start as <strong className="text-[var(--ink)]">Open</strong>
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create work order"
              : "Save changes"}
        </button>
        <button
          type="button"
          className="btn-ghost"
          disabled={pending}
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
