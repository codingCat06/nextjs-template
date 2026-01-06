# PAGES.md

Route catalog for the Next.js Full-Stack Template.

## Public Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Guest | Landing page with feature overview |
| `/sign-in` | Guest | Email/password sign in |
| `/sign-up` | Guest | Create new account |

**Note:** Authenticated users are redirected to `/dashboard` when accessing auth pages.

---

## Protected Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/dashboard` | Authenticated | User dashboard with quick links |
| `/files` | Authenticated | File upload and list |
| `/files/[id]` | Authenticated | File detail / PDF viewer |

**Guard:** `src/app/(protected)/layout.tsx` - Redirects to `/sign-in` if not authenticated.

---

## Admin Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/admin` | Admin | Admin dashboard |
| `/admin/users` | Admin | User management |

**Guard:** `src/app/(protected)/admin/layout.tsx` - Redirects to `/dashboard` if not admin.

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...all]` | GET, POST | Better Auth handler |
| `/api/trpc/[trpc]` | GET, POST | tRPC handler |

---

## Header Navigation

### Unauthenticated
- Sign In (link)
- Sign Up (button)
- Theme toggle

### Authenticated (User)
- Dashboard
- Files
- User menu (profile, sign out)
- Theme toggle

### Authenticated (Admin)
- Dashboard
- Files
- Admin
- User menu (profile, sign out)
- Theme toggle

---

## Data Dependencies

| Page | tRPC Procedures | Server Actions |
|------|-----------------|----------------|
| `/dashboard` | - | `getServerSession` |
| `/files` | `files.list`, `files.upload`, `files.delete`, `files.getDownloadUrl` | - |
| `/files/[id]` | `files.getById`, `files.getDownloadUrl` | - |
| `/admin/users` | `admin.getUsers`, `admin.setUserActiveStatus`, `admin.setUserRole` | - |
