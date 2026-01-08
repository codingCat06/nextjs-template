# FEATURES.md

Feature catalog for the Next.js Full-Stack Template (FSD Architecture).

---

## FSD Layer Overview

```
shared → entities → features → widgets → app
```

| Layer | Purpose |
|-------|---------|
| `shared/` | Reusable UI components, utilities (no business logic) |
| `entities/` | Business entity types (user, file) |
| `features/` | Complex user interaction logic (hooks) |
| `widgets/` | Smart composite components (use tRPC, compose features) |
| `core/` | Auth, theme (cross-cutting) |
| `server/` | DB, storage, tRPC (cross-cutting) |

---

## Core (`src/core/`)

### Authentication (`src/core/auth/`)

Email/password + OAuth authentication using Better Auth.

| Export | Type | Description |
|--------|------|-------------|
| `auth` | Object | Server-side auth instance |
| `authClient` | Object | Client-side auth utilities |
| `signIn` | Function | Sign in with email/password |
| `signUp` | Function | Create new account |
| `signOut` | Function | Sign out current user |
| `useSession` | Hook | Get current session (client) |
| `getServerSession` | Function | Get session (server) |
| `requireAuth` | Function | Guard for protected routes |
| `requireAdmin` | Function | Guard for admin routes |

**OAuth Providers:** Google, GitHub, Naver

**Env vars:**
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`

### Theme (`src/core/theme/`)

Light/dark mode with system preference detection.

| Export | Type | Description |
|--------|------|-------------|
| `ThemeProvider` | Component | Theme context provider |
| `useTheme` | Hook | Access theme state and setter |

**Storage:** localStorage (`theme` key)

---

## Shared Layer (`src/shared/`)

### UI Components (`src/shared/ui/`)

Reusable shadcn/ui-style components. No business logic.

| Component | Description |
|-----------|-------------|
| `Button` | Button with variants (default, destructive, outline, secondary, ghost, link) |
| `Input` | Text input field |
| `Label` | Form label |
| `Card` | Card container with Header, Title, Description, Content, Footer |
| `Avatar` | User avatar with fallback |
| `DropdownMenu` | Dropdown menu with items |
| `Dialog` | Modal dialog |
| `Progress` | Progress bar |
| `Switch` | Toggle switch |
| `ThemeToggle` | Light/dark mode toggle |

### Utilities (`src/shared/lib/`)

| Export | Location | Description |
|--------|----------|-------------|
| `cn` | `utils.ts` | Tailwind class name merger |
| `formatBytes` | `utils.ts` | Format bytes to human-readable |
| `formatDate` | `utils.ts` | Format date to locale string |
| `trpc` | `trpc/client.ts` | tRPC client hooks |
| `TRPCProvider` | `trpc/provider.tsx` | tRPC React Query provider |

---

## Entities Layer (`src/entities/`)

### User (`src/entities/user/`)

| Type | Description |
|------|-------------|
| `UserRole` | `"user" \| "admin"` |
| `User` | Full user object |
| `UserListItem` | User for admin list display |

### File (`src/entities/file/`)

| Type | Description |
|------|-------------|
| `FileMetadata` | Full file metadata |
| `FileItem` | File for list display |
| `UploadingFile` | File with upload progress state |

---

## Features Layer (`src/features/`)

### File Upload (`src/features/file-upload/`)

Complex file upload logic with progress tracking.

| Export | Type | Description |
|--------|------|-------------|
| `useFileUpload` | Hook | Upload files with progress, retry, cancel |

### User Management (`src/features/user-management/`)

Admin user action logic.

| Export | Type | Description |
|--------|------|-------------|
| `useUserActions` | Hook | Activate, deactivate, promote, demote users |

---

## Widgets Layer (`src/widgets/`)

Smart composite components that use tRPC and compose features.

### Header (`src/widgets/header/`)

Global navigation header with auth state.

### Auth (`src/widgets/auth/`)

| Export | Type | Description |
|--------|------|-------------|
| `OAuthButtons` | Component | Google, GitHub, Naver sign-in buttons |

### User List (`src/widgets/user-list/`)

Admin user list with status controls.

| Export | Type | Description |
|--------|------|-------------|
| `UserList` | Component | User table with activate/deactivate, role actions |

**Local UI:** `ui/user-row.tsx`, `ui/action-dialog.tsx`

### File List (`src/widgets/file-list/`)

User file list with actions.

| Export | Type | Description |
|--------|------|-------------|
| `FileList` | Component | File table with download, delete, view actions |

**Local UI:** `ui/file-row.tsx`, `ui/delete-dialog.tsx`

### File Upload (`src/widgets/file-upload/`)

Drag & drop file uploader.

| Export | Type | Description |
|--------|------|-------------|
| `FileUpload` | Component | Dropzone with progress display |

**Props:** `onUploadComplete?`, `maxSizeBytes?`, `acceptedTypes?`

**Local UI:** `ui/dropzone.tsx`, `ui/upload-item.tsx`

### PDF Viewer (`src/widgets/pdf-viewer/`)

PDF viewer using pdf.js.

| Export | Type | Description |
|--------|------|-------------|
| `PdfViewer` | Component | PDF document viewer |

**Props:** `url` (required)

---

## Server (`src/server/`)

### Database (`src/server/db/`)

Drizzle ORM with MySQL. Schema split by domain.

| Schema File | Tables |
|-------------|--------|
| `schema/auth.schema.ts` | `user`, `session`, `account`, `verification` |
| `schema/file.schema.ts` | `file` |

### Storage (`src/server/storage/`)

Cloudflare R2 integration.

| Function | Description |
|----------|-------------|
| `uploadFile` | Upload file to R2 |
| `getFileStream` | Get file as stream |
| `deleteFile` | Delete file from R2 |
| `getPresignedUploadUrl` | Generate presigned upload URL |
| `getPresignedDownloadUrl` | Generate presigned download URL |
| `generateStorageKey` | Generate unique storage key |

**Env vars:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### tRPC (`src/server/trpc/`)

Type-safe API layer.

**Routers:**
- `files`: File CRUD operations
- `admin`: User management (admin only)
