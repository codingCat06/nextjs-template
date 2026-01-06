# PRD – Next.js Full-Stack Template (Auth + File Management + Admin)

## 1. Purpose
This repository is a **production-grade Next.js template** that can be copied to start new projects quickly.

This is not a demo-only starter. It must provide:
- a clean architecture and folder structure
- reusable UI components and feature modules
- strong TypeScript typing
- consistent documentation for LLM-assisted development

## 2. Target Users
- Solo developers / indie hackers
- Teams building Next.js App Router apps
- Anyone who wants a reusable base with auth + file management + admin

## 3. Fixed Tech Stack (Non-Negotiable)
LLMs must not replace or propose alternatives to these core choices:
- Framework: **Next.js (App Router)**
- Language: **TypeScript (strict)**
- Styling: **Tailwind CSS**
- UI: **shadcn/ui**
- Client state: **Zustand**
- Data fetching: **tRPC + React Query**
- Auth: **Better Auth (email/password)**
- ORM: **Drizzle**
- Database: **MySQL**
- File storage: **Cloudflare R2**
- PDF viewer: **pdf.js**

## 4. Core Principles
### 4.1 Template-First
Everything should be designed for reuse and predictable extension.

### 4.2 Separation of Concerns
- `core/`: auth, session, guards, permissions, shared policies
- `features/`: domain modules (file management, admin, etc.)
- `ui/`: pure reusable UI components (no business logic)
- `server/`: db, storage(R2), tRPC routers, server-only utilities
- `types/`: shared domain types

Features must not implicitly depend on other features.

### 4.3 Type-Driven Design
- No `any`
- Shared types centralized in `src/types`
- API inputs/outputs are strongly typed

### 4.4 Documentation as a First-Class Artifact
Docs must be updated whenever features/pages change.

## 5. Roles & Permissions
### 5.1 Guest
- Can access landing page
- Can sign up / sign in
- Cannot access protected pages

### 5.2 Authenticated User
- Can upload files
- Can view list of owned files
- Can download and delete owned files
- Can view PDF files in a built-in viewer (pdf.js)

### 5.3 Admin
- Can access admin pages
- Can view user list
- Can manage basic account status (active/disabled)

## 6. Required Pages & Navigation
### 6.1 Public
- `/` – Landing / Demo home
- `/sign-in`
- `/sign-up`

### 6.2 Protected (auth required)
- `/dashboard`
- `/files` – file upload + list + actions
- `/files/[id]` – file detail / PDF viewer page

### 6.3 Admin
- `/admin`
- `/admin/users`

### 6.4 Header
- Header must exist globally and show:
  - navigation links to example pages
  - auth state (sign in/up vs user menu + logout)
  - light/dark mode toggle

## 7. Authentication Requirements (Better Auth)
- email/password sign-up
- login / logout
- session-based auth
- server-side route protection
- user menu in header (authenticated state)
- optional password change UI is allowed (not required for MVP unless implemented)

Unauthenticated users attempting to access protected routes must be redirected to `/sign-in`.

## 8. Theme Requirements (Light/Dark Mode)
- Must support **Light/Dark mode**
- Toggle switch in **Header** to turn on/off
- On first visit, default to **system preference**
- Persist user selection (localStorage or cookie)
- Use Tailwind `dark` class strategy (toggle `dark` on `html` preferred)

## 9. File Management Requirements (Cloudflare R2)
### 9.1 Server Capabilities
- Upload a file
- List files for the current user
- Download a file (safe access; do not expose secrets)
- Delete a file
- (Optional) Provide pre-signed URLs for upload/download

### 9.2 File Metadata (Minimum)
- `id` (internal file id)
- `ownerUserId`
- `originalName`
- `storageKey` (R2 object key)
- `sizeBytes`
- `mimeType`
- `createdAt`

### 9.3 UI Requirements
#### Upload UI
- drag & drop
- click to select file
- progress / loading state
- clear error states

#### File List UI
- list and item views
- item shows name/type/size/date
- item actions:
  - download button
  - delete button
- action buttons must be **customizable** (override labels, icons, handlers where appropriate)

#### PDF Viewer UI
- a file detail page for PDF using pdf.js
- basic controls (page navigation, zoom) are optional but recommended

## 10. Admin Requirements
- user list page
- minimal account state control:
  - set active/disabled
- no complex RBAC (explicitly out of scope)

## 11. Environment & Secrets Requirements
- All secrets/config must be in `.env` (gitignored)
- Repo must include `.env.example` with same keys and blank values
- Only use `NEXT_PUBLIC_*` for values safe to expose to the browser

## 12. Required Documents (Must Exist)
- `PRD.md`
- `claude.md`
- `FEATURES.md` (feature catalog)
- `PAGES.md` (route catalog)
- `.env.example`

## 13. Non-Goals
- payments/subscriptions
- social login
- email verification & password reset flows (unless explicitly added later)
- realtime websockets
- complex role systems / multi-tenant org management

## 14. Success Criteria
- A new project can be started by copying this repo
- Auth + file upload + admin work out of the box
- Structure stays clean under LLM-assisted development
- Docs remain accurate as the template evolves
