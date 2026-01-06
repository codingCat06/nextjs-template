# Next.js Full-Stack Template

Production-grade Next.js template with authentication, file management, and admin capabilities.

## Requirements

### System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.x LTS | Required for local development |
| npm | 10.x+ | Comes with Node.js |
| Docker | 24.x+ | Optional, for containerized setup |
| Docker Compose | 2.x+ | Optional, for containerized setup |

### External Services

| Service | Required | Purpose | Setup Guide |
|---------|----------|---------|-------------|
| MySQL | Yes | Database | Local install or Docker |
| Cloudflare R2 | Yes | File storage | [R2 Setup](#cloudflare-r2-setup) |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Client State | Zustand |
| Data Fetching | tRPC + React Query |
| Auth | Better Auth (email/password) |
| ORM | Drizzle |
| Database | MySQL 8.0+ |
| File Storage | Cloudflare R2 |
| PDF Viewer | pdf.js |

---

## Setup Guide

### Option 1: Docker Setup (Recommended)

Docker를 사용하면 MySQL을 별도로 설치할 필요가 없습니다.

#### 1. Clone and configure

```bash
# Clone the repository
git clone <repository-url>
cd nextjs-template

# Copy environment file
cp .env.example .env
```

#### 2. Configure environment variables

`.env` 파일을 열고 다음 값들을 설정하세요:

```env
# Docker가 자동으로 설정함 (수정 불필요)
DATABASE_URL=mysql://root:password@db:3306/nextjs_template

# 필수: Auth 시크릿 (아래 명령어로 생성)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 필수: Cloudflare R2 설정
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
```

Auth 시크릿 생성:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

#### 3. Start with Docker Compose

```bash
# Start development environment (includes MySQL)
docker-compose up -d

# View logs
docker-compose logs -f app

# Push database schema
docker-compose exec app npm run db:push
```

#### 4. Access the application

Open [http://localhost:3000](http://localhost:3000)

---

### Option 2: Local Setup (Without Docker)

#### 1. Install Node.js

Download and install [Node.js 20 LTS](https://nodejs.org/).

```bash
# Verify installation
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

#### 2. Install MySQL

**Windows:**
- Download [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Install MySQL Server 8.0+
- Create a database: `CREATE DATABASE nextjs_template;`

**Mac:**
```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE nextjs_template;"
```

**Linux:**
```bash
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql -e "CREATE DATABASE nextjs_template;"
```

#### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Local MySQL connection
DATABASE_URL=mysql://root:your-password@localhost:3306/nextjs_template

# Auth configuration
BETTER_AUTH_SECRET=generate-a-random-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudflare R2 (see setup guide below)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

#### 4. Install dependencies and setup database

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push
```

#### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Cloudflare R2 Setup

파일 업로드 기능을 사용하려면 Cloudflare R2를 설정해야 합니다.

### 1. Create Cloudflare account

[Cloudflare Dashboard](https://dash.cloudflare.com/)에서 계정을 생성하세요.

### 2. Create R2 bucket

1. Dashboard에서 **R2 Object Storage** 선택
2. **Create bucket** 클릭
3. Bucket 이름 입력 (예: `my-app-files`)
4. Location 선택 후 생성

### 3. Create API token

1. **R2 Object Storage** > **Manage R2 API Tokens**
2. **Create API token** 클릭
3. Permissions: **Object Read & Write**
4. Specify bucket: 생성한 bucket 선택
5. **Create API Token** 클릭
6. 표시된 값들을 복사:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`

### 4. Get Account ID

1. Dashboard 우측 상단의 **Account Home** 클릭
2. URL에서 Account ID 확인: `dash.cloudflare.com/<ACCOUNT_ID>/...`
3. 또는 R2 페이지 우측 사이드바에서 확인

### 5. Update .env

```env
R2_ACCOUNT_ID=your-account-id-here
R2_ACCESS_KEY_ID=your-access-key-here
R2_SECRET_ACCESS_KEY=your-secret-key-here
R2_BUCKET_NAME=my-app-files
```

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MySQL connection string | `mysql://user:pass@localhost:3306/db` |
| `BETTER_AUTH_SECRET` | Yes | Random secret for auth sessions | `K7gN...` (32+ chars) |
| `BETTER_AUTH_URL` | Yes | Backend URL for auth | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (client-side) | `http://localhost:3000` |
| `R2_ACCOUNT_ID` | Yes | Cloudflare account ID | `a1b2c3d4...` |
| `R2_ACCESS_KEY_ID` | Yes | R2 API access key | `a1b2c3d4...` |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API secret key | `xyz789...` |
| `R2_BUCKET_NAME` | Yes | R2 bucket name | `my-app-files` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |

---

## Docker Commands

```bash
# Development
docker-compose up -d              # Start dev environment
docker-compose down               # Stop all services
docker-compose logs -f app        # View app logs
docker-compose exec app sh        # Shell into container

# Database operations
docker-compose exec app npm run db:push    # Push schema
docker-compose exec app npm run db:studio  # Open Drizzle Studio

# Production build
docker-compose --profile production up -d app-prod

# Build image only
docker build -t nextjs-template --target production .
```

---

## Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── (auth)/         # Auth pages (sign-in, sign-up)
│   ├── (protected)/    # Protected pages (dashboard, files, admin)
│   └── api/            # API routes (auth, trpc)
├── core/               # Auth, theme, guards
├── features/           # Domain modules
│   ├── file-management/
│   └── admin-users/
├── ui/                 # Reusable UI components
├── server/             # DB, storage, tRPC
│   ├── db/             # Drizzle schema
│   ├── storage/        # R2 integration
│   └── trpc/           # tRPC routers
├── types/              # Shared types
└── lib/                # Utilities
```

---

## Features

### Authentication
- Email/password sign up and sign in
- Session-based authentication
- Protected routes with automatic redirect
- User roles (user, admin)

### File Management
- Drag & drop file upload
- File list with download/delete actions
- PDF viewer with navigation and zoom
- Cloudflare R2 storage

### Admin
- User list view
- Toggle user active/inactive status
- Set user roles

### Theme
- Light/dark mode toggle in header
- System preference detection
- Persistent preference (localStorage)

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/sign-in` | Guest | Sign in page |
| `/sign-up` | Guest | Sign up page |
| `/dashboard` | Auth | User dashboard |
| `/files` | Auth | File management |
| `/files/[id]` | Auth | File detail / PDF viewer |
| `/admin` | Admin | Admin dashboard |
| `/admin/users` | Admin | User management |

---

## Troubleshooting

### Database connection error

```
Error: Failed query: select ... from `user`
```

**Solution:** Database tables not created. Run:
```bash
npm run db:push
```

### R2 upload fails

**Check:**
1. All R2 environment variables are set
2. API token has correct permissions (Object Read & Write)
3. Bucket name matches exactly

### Slow development compilation

If pages take long to compile, ensure you're using Turbopack:
```bash
npm run dev  # Uses --turbo flag
```

---

## Documentation

| File | Description |
|------|-------------|
| `PRD.md` | Product requirements |
| `claude.md` | LLM development contract |
| `FEATURES.md` | Feature catalog |
| `PAGES.md` | Route catalog |

---

## License

MIT
