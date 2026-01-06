# FEATURES.md

Feature catalog for the Next.js Full-Stack Template.

## Core Features

### Authentication (`src/core/auth/`)

Email/password authentication using Better Auth.

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

**Env vars:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`

### Theme (`src/core/theme/`)

Light/dark mode with system preference detection.

| Export | Type | Description |
|--------|------|-------------|
| `ThemeProvider` | Component | Theme context provider |
| `useTheme` | Hook | Access theme state and setter |

**Storage:** localStorage (`theme` key)

---

## Feature Modules

### File Management (`src/features/file-management/`)

Upload, list, download, and delete files via Cloudflare R2.

| Export | Type | Description |
|--------|------|-------------|
| `FileUpload` | Component | Drag & drop file uploader |
| `FileList` | Component | List of user's files with actions |
| `PdfViewer` | Component | PDF viewer using pdf.js |

**Props:**
- `FileUpload`: `onUploadComplete?`, `maxSizeBytes?`, `acceptedTypes?`
- `FileList`: `downloadLabel?`, `deleteLabel?`, `viewLabel?`
- `PdfViewer`: `url` (required)

**Env vars:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

### Admin Users (`src/features/admin-users/`)

User management for administrators.

| Export | Type | Description |
|--------|------|-------------|
| `UserList` | Component | Admin user list with status controls |

---

## UI Components (`src/ui/`)

Reusable shadcn/ui-style components.

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
| `Header` | Global navigation header |

---

## Server (`src/server/`)

### Database (`src/server/db/`)

Drizzle ORM with MySQL.

**Tables:** `user`, `session`, `account`, `verification`, `file`

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

### tRPC (`src/server/trpc/`)

Type-safe API layer.

**Routers:**
- `files`: File CRUD operations
- `admin`: User management (admin only)

---

## Utilities (`src/lib/`)

| Function | Description |
|----------|-------------|
| `cn` | Tailwind class name merger |
| `formatBytes` | Format bytes to human-readable |
| `formatDate` | Format date to locale string |
