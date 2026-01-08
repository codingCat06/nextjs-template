# claude.md – LLM Development Contract

This file is the **contract** for LLM-assisted development in this repo.
Claude (or any LLM) must follow these rules strictly.

---

## 1) Sources of truth

* **Product scope (stable):** `PRD.md`

  * PRD is the *baseline promise* of what this template is (goals, non-goals, fixed stack, required capabilities).
  * **Do not update PRD for every small implementation change.**
  * Update PRD **only when scope/requirements change** (e.g., adding/removing a major capability, changing non-goals, changing the fixed stack).

* **Architecture rules (stable):** this `claude.md`

* **Report formats (separate, editable):**

  * `docs/templates/FEATURES.template.md`
  * `docs/templates/PAGES.template.md`

* **Living inventory (frequently updated):**

  * `FEATURES.md` (what exists / how to use it)
  * `PAGES.md` (what routes exist / access rules)

---

## 2) Required docs (must exist in repo)

* `PRD.md`
* `claude.md`
* `FEATURES.md` (generated/updated using template)
* `PAGES.md` (generated/updated using template)
* `.env.example`

---

## 3) Report docs policy (FEATURES.md / PAGES.md)

### 3.1 FEATURES.md

* Must follow: `docs/templates/FEATURES.template.md`
* Update triggers (must update **in same PR**):

  * adding/removing a feature module
  * adding/removing a reusable UI component in `src/ui` that is meant for reuse
  * adding/changing a public API surface (exported function/hook/component)
  * changing customization points
  * adding/changing required env vars

### 3.2 PAGES.md

* Must follow: `docs/templates/PAGES.template.md`
* Update triggers (must update **in same PR**):

  * adding/removing/renaming routes
  * changing access level (public/protected/admin)
  * changing header navigation
  * changing page-level data dependencies (tRPC procedures, server actions)

**Important:** `FEATURES.md` and `PAGES.md` are **reports**, not design docs.
They must be concise, accurate, and easy to scan.

---

## 4) Environment & secrets (mandatory)

* All secrets/config must live in **`.env`** (never hardcode secrets in code).
* **`.env` must be gitignored**.
* The repo must include **`.env.example`** with the **same keys** as `.env`, but with **blank/placeholder values**.
* If a new env var is introduced, Claude must:

  * add it to `.env.example`
  * document it in `FEATURES.md` (and `PAGES.md` if page behavior depends on it)
* Only use `NEXT_PUBLIC_*` for values safe to expose to the browser.
* Never write real secret values into code, commits, issues, or markdown.

Recommended `.gitignore` rule:

* Ignore: `.env`, `.env.*`
* Allow: `!.env.example`

---

## 5) Theme mode requirement (mandatory)

The template must support **Light/Dark mode**:

* A toggle switch must be placed in the **Header**.
* Default behavior: follow **system preference** on first visit.
* Persist the user choice (localStorage or cookie) across reloads.
* Apply theme using Tailwind's `dark` class strategy (toggle class on `html` preferred).
* Do **not** add dependencies unless truly necessary; if added, justify in `FEATURES.md`.

Any change here requires updates to `FEATURES.md` and `PAGES.md`.

---

## 6) Architecture & folder rules (FSD - Feature-Sliced Design)

### 6.1 Layer responsibilities

* `src/shared/`

  * `ui/` - reusable UI components only (no business logic, no DB, no auth, no tRPC)
  * `lib/` - pure utilities (formatters, validators, constants, tRPC client)

* `src/entities/`

  * business entity types (user, file)
  * base models and interfaces
  * no logic, only type definitions

* `src/features/`

  * complex user interaction logic (hooks with business logic)
  * must not depend on other features
  * examples: file-upload (progress tracking), user-management (role actions)

* `src/widgets/`

  * composite UI blocks (smart components)
  * can use tRPC, compose features, include local UI parts
  * examples: header, user-list, file-list, file-upload, pdf-viewer, auth (OAuth buttons)

* `src/core/`

  * auth integration (Better Auth), session helpers, guards, permission checks, theme provider

* `src/server/`

  * `db/` - Drizzle ORM, schema files (split by domain: auth.schema.ts, file.schema.ts)
  * `storage/` - R2 integration
  * `trpc/` - tRPC routers, server-only helpers

### 6.2 FSD Layer hierarchy (lower cannot import upper)

`shared` → `entities` → `features` → `widgets` → `app`

* `core` and `server` are cross-cutting: accessible from features, widgets, and app
* No circular dependencies

---

## 7) TypeScript rules

* `strict: true`
* no `any`
* entity types live in `src/entities/` (per domain: user, file)
* API I/O must be typed; runtime validation must match types

---

## 8) LLM behavior constraints

Claude must:

* follow existing patterns
* keep changes minimal and focused
* update docs when code changes affect features/pages

Claude must NOT:

* change the tech stack
* introduce hidden magic
* leak secrets into code or docs

---

## 9) Workflow rule

1. If **scope/requirements** change: update `PRD.md` first (otherwise keep PRD stable)
2. Implement code
3. Update `FEATURES.md` and/or `PAGES.md` in the same PR if triggered
4. Ensure `.env.example` matches `.env` keys
