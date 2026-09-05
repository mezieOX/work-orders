# ForgeDesk — Technician Work Orders

Small Next.js App Router app for managing technician work orders. Built for a 4–8 hour full-stack assessment: clean server/client boundaries, file-based persistence, Zod validation, and right-sized tests.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Zod** (server-side validation)
- **File-based JSON** (`data/work-orders.json`) — no database
- **Vitest** for unit/integration tests

## Quick start

Requires **Node 20+**. This project pins **pnpm 9** (pnpm 11 via Corepack can crash on Node 20 with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`).

```bash
# If `pnpm` errors on Node 20, install a real binary once:
#   corepack disable && npm install -g pnpm@9.15.9

pnpm install
pnpm seed          # write sample work orders into data/work-orders.json
pnpm dev           # http://localhost:3000
```

Or with npm:

```bash
npm install
npm run seed
npm run dev
```

Other scripts:

```bash
pnpm test          # run Vitest once
pnpm build && pnpm start
pnpm lint
```

## Features

| Story | Where |
| --- | --- |
| List work orders | `/` — title, priority, status, updatedAt |
| Create | `/work-orders/new` → `POST /api/work-orders` |
| Detail | `/work-orders/[id]` |
| Edit | `/work-orders/[id]/edit` → `PUT /api/work-orders/[id]` |
| Delete | Detail page → `DELETE /api/work-orders/[id]` |
| Filter | Status filter on the list (`?status=Open`) |

### Filter vs search (scope choice)

**Chose status filter** over title text search to keep the timebox tight while still proving query-param → server filtering. Easy to extend with `?q=` later on the same `listWorkOrders` helper.

## Architecture notes

- **Server Components by default** for list/detail pages; they call the data module directly.
- **Client Components** only for interactive bits: create/edit form, status filter, delete button, flash banners.
- **CRUD via Route Handlers** under `src/app/api/work-orders/`.
- **Persistence** lives in `src/lib/work-orders.ts` (Node `fs` only — never imported into Client Components).
- Descriptions render as plain text (`whitespace-pre-wrap`) — **no** `dangerouslySetInnerHTML`.

### Cache choice

Route Handlers and list/detail pages use `dynamic = "force-dynamic"` and `Cache-Control: no-store`.

**Why:** the source of truth is a mutable JSON file on disk. Next’s fetch/data cache would risk serving stale lists after create/edit/delete. For this tiny file store, always reading fresh data is the pragmatic choice. (If this grew into a real DB with tagged revalidation, we could switch to `revalidatePath` / `revalidateTag` instead.)

## API shape

```http
GET    /api/work-orders?status=Open|In%20Progress|Done
POST   /api/work-orders
GET    /api/work-orders/:id
PUT    /api/work-orders/:id
DELETE /api/work-orders/:id
```

Validation errors return HTTP 400 with field-level `fieldErrors` for the form UI.

## Testing

```bash
pnpm test
```

Included:

1. **Zod schema tests** — rejects invalid titles / statuses.
2. **Data module test** — create → list against a temporary JSON directory (core create → list flow).

Playwright E2E was skipped to stay within the timebox.

## Timebox trade-offs

- Status filter only (no text search).
- No auth, DB, uploads, or Playwright.
- Minimal a11y extras: labels, `aria-invalid`, focus first field error on failed submit, `prefers-reduced-motion`.

## Demo / application videos

Add your shareable links here before submitting:

- Demo video (≤ 5 min): _link_
- Self-presentation (≤ 1 min): _link_
