# FEATURES.md Template

Use this template when updating FEATURES.md.

## Structure

```markdown
# FEATURES.md

Feature catalog for [Project Name].

## Core Features

### [Feature Name] (`src/[path]/`)

Brief description.

| Export | Type | Description |
|--------|------|-------------|
| `name` | Type | Description |

**Env vars:** `VAR1`, `VAR2`

---

## Feature Modules

### [Module Name] (`src/features/[name]/`)

Brief description.

| Export | Type | Description |
|--------|------|-------------|
| `name` | Type | Description |

**Props:** (for components)
- `ComponentName`: `prop1`, `prop2?`

**Env vars:** (if applicable)

---

## UI Components (`src/ui/`)

| Component | Description |
|-----------|-------------|
| `Name` | Description |

---

## Server (`src/server/`)

### [Section] (`src/server/[path]/`)

Description.

| Function/Table | Description |
|----------------|-------------|
| `name` | Description |

---

## Utilities (`src/lib/`)

| Function | Description |
|----------|-------------|
| `name` | Description |
```

## Update Triggers

Update FEATURES.md when:
- Adding/removing a feature module
- Adding/removing a reusable UI component in `src/ui`
- Adding/changing a public API surface (exported function/hook/component)
- Changing customization points (props)
- Adding/changing required env vars
