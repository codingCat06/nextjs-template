# PAGES.md Template

Use this template when updating PAGES.md.

## Structure

```markdown
# PAGES.md

Route catalog for [Project Name].

## Public Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/path` | Guest | Description |

---

## Protected Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/path` | Authenticated | Description |

**Guard:** `src/app/(group)/layout.tsx` - Description

---

## Admin Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/admin/path` | Admin | Description |

**Guard:** Path and description

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/path` | GET, POST | Description |

---

## Header Navigation

### [State Name]
- Item 1
- Item 2

---

## Data Dependencies

| Page | tRPC Procedures | Server Actions |
|------|-----------------|----------------|
| `/path` | `router.procedure` | `actionName` |
```

## Update Triggers

Update PAGES.md when:
- Adding/removing/renaming routes
- Changing access level (public/protected/admin)
- Changing header navigation
- Changing page-level data dependencies (tRPC procedures, server actions)
