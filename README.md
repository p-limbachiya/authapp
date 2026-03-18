# Auth App (Next.js)

A modern authentication application built with Next.js (App Router), TypeScript, Chakra UI, and Redux Toolkit, featuring role-based access control and protected routes.

## 🚀 Features

- **User Authentication** - Secure login system with form validation
- **Role-Based Access Control (RBAC)** - Different access levels for Admin and User roles
- **Protected Routes** - Route guards to prevent unauthorized access
- **Dashboard** - User-specific dashboard with personalized content
- **Admin Panel** - Administrative interface for managing users and viewing reports
- **Reports Page** - Data visualization and reporting functionality
- **State Management** - Redux Toolkit for efficient state management
- **Modern UI** - Beautiful and responsive interface using Chakra UI
- **Form Handling** - React Hook Form for efficient form management
- **Routing** - Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript 5.9.3
- **UI Library**: Chakra UI 2.10.1
- **State Management**: Redux Toolkit 2.11.2
- **Form Management**: React Hook Form 7.71.1
- **Animations**: Framer Motion 7.10.0
- **Styling**: Emotion (React & Styled)

## 📁 Project Structure

```
authapp/
├── app/               # Next.js App Router routes
├── src/
│   ├── api/           # API integration and services
│   ├── components/    # Shared UI + route guards/layout
│   ├── pages/         # Page content components (used by app routes)
│   └── redux/         # Redux store and slices
├── public/            # Static assets
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🔐 User Roles

The application supports two user roles:

1. **Admin** - Full access to all features including:
   - Dashboard
   - Admin panel
   - Reports
   - User management

2. **User** - Limited access to:
   - Dashboard
   - Personal profile
   - Basic features

## 🎯 Available Pages

- `/` - Login page
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin panel (admin only)
- `/reports` - Reports page (protected)
- `/not-authorized` - Unauthorized access page
- `*` - 404 Not Found page

## 🔌 Backend API (Node.js)

This repo also includes a minimal Express backend in `backend/` that mirrors the current frontend auth + RBAC behavior.

### Admin credentials (seeded)

- **Email**: `admin@example.com`
- **Password**: `password`

You can change these via `backend/.env` (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`) and re-run the seed.

### Endpoints

- `POST /auth/login` → `{ user, token, expiresAt }`
- `POST /auth/validate` → `{ valid: true }` (or `401` with `{ valid: false, code, error }`)
- `GET /auth/me` (auth) → `{ user }`
- `GET /dashboard/stats` (auth) → dashboard stats used by the UI
- `GET /reports` (auth + role: `admin|manager`) → dummy reports list
- `GET /admin/users` (auth + role: `admin`) → list users
- `POST /admin/users` (auth + role: `admin`) → create user
- `PUT /admin/users/:id` (auth + role: `admin`) → update user
- `DELETE /admin/users/:id` (auth + role: `admin`) → delete user

### Run backend

1. Copy env file and set a secret:

```bash
cp backend/.env.example backend/.env
```

2. Install + sync DB + seed + run:

If your Postgres database is shared / already has tables, **use a dedicated schema** in `DATABASE_URL`, e.g. add `&schema=authapp` (or `?schema=authapp` depending on what’s already in the URL).

3. Commands:

```bash
cd backend
npm install
npm run prisma:push
npm run seed
npm run dev
```

### Frontend → backend URL

Set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000`) in your frontend environment.

## 🧭 Deploy backend to Render, run frontend locally

### Render backend

Create a Render **Web Service** with:
- **Root directory**: `backend`
- **Build command**:

```bash
npm install && npx prisma generate
```

- **Start command**:

```bash
npm start
```

Set these **environment variables** in Render:
- `DATABASE_URL` (your Neon URL)
- `DB_SCHEMA=authapp_rbac` (or any new schema name)
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=http://localhost:3000` (while you run frontend locally)
- `NODE_ENV=production`

Optional (seed admin identity):
- `SEED_ADMIN_EMAIL=admin@example.com`
- `SEED_ADMIN_PASSWORD=password`
- `SEED_ADMIN_NAME=Alice Admin`

Then run seed once (Render Shell):

```bash
node prisma/seed.js
```

### Local frontend (points to Render)

Copy the example env file and put your Render backend URL:

```bash
cp .env.local.example .env.local
```

Set:
- `NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com`
