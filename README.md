# TaskFlow

> A full-stack Task Management Web Application built with React.js, Node.js/Express, and MongoDB.

[![GitHub](https://img.shields.io/badge/GitHub-HrithikArya%2FTMWA-181717?logo=github)](https://github.com/HrithikArya/TMWA)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue)](http://localhost:5000/api/docs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3, Dark Mode |
| State (Auth) | React Context API |
| State (Tasks) | Redux Toolkit (slice + createAsyncThunk) |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testing | Jest + Supertest (backend), Vitest + RTL (frontend) |
| Deployment | Render (backend), Vercel (frontend) |

---

## Features

### Core
- User Signup & Login with JWT authentication
- Create, Read, Update, Delete tasks
- Mark tasks as Pending / Completed (one-click toggle)
- Filter tasks: All / Pending / Completed
- Responsive UI — mobile + desktop
- Dark mode (persisted in localStorage)

### Bonus
- Role-based access control (Admin / User)
- Admin dashboard showing all users' tasks with owner info
- Pagination (10 per page) + Search (debounced)
- Unit & integration tests (Jest + Supertest + Vitest + RTL)
- Deployment config (Render + Vercel)
- Swagger API documentation at `/api/docs`
- Error boundary + 401 auto-logout

---

## Project Structure

```
TMWA/
├── backend/          # Node.js + Express + TypeScript API
│   └── src/
│       ├── config/       # DB connection, env validation
│       ├── controllers/  # Thin route handlers
│       ├── middleware/   # Auth, role guard, error handler
│       ├── models/       # Mongoose User + Task models
│       ├── routes/       # Express routers
│       ├── scripts/      # Seed script
│       ├── services/     # Business logic layer
│       ├── swagger/      # OpenAPI config
│       ├── tests/        # Jest + Supertest test suites
│       ├── types/        # Express augmentation
│       ├── utils/        # asyncHandler, apiResponse, logger
│       ├── validators/   # express-validator schemas
│       ├── app.ts        # Express app (no listen)
│       └── server.ts     # Entry point (listen)
│
├── frontend/         # React + TypeScript + Vite SPA
│   └── src/
│       ├── app/          # Redux store + typed hooks
│       ├── features/     # tasks slice (state, thunks)
│       ├── components/   # UI primitives + feature components
│       ├── context/      # AuthContext
│       ├── hooks/        # useAuth, useDebounce, useDarkMode
│       ├── pages/        # LoginPage, SignupPage, DashboardPage, AdminPage
│       ├── tests/        # Vitest + RTL test suites
│       ├── types/        # Shared TypeScript types
│       └── utils/        # cn, formatDate, apiFetch, logoutBridge
│
├── render.yaml       # Render deployment config
└── BUILD_STATUS.md   # Cross-session build tracker
```

---

## Local Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/HrithikArya/TMWA.git
cd TMWA
```

### 2. Install Dependencies
```bash
npm install
```
> Installs dependencies for both workspaces (backend + frontend) via npm workspaces.

### 3. Configure Environment Variables

**Backend** — copy and fill in:
```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** — copy and fill in:
```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run the App

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Swagger Docs: http://localhost:5000/api/docs

### 5. Seed Admin & User Accounts

```bash
cd backend && npx ts-node src/scripts/seed.ts
```

Creates:
- **Admin**: `admin@taskflow.com` / `Admin@12345`
- **User**: `user@taskflow.com` / `User@12345`

---

## Running Tests

```bash
# All tests (backend + frontend)
npm test

# Backend only (30 tests)
npm run test:backend

# Frontend only (16 tests)
npm run test:frontend

# With coverage
npm run test:backend -- --coverage
npm run test:frontend -- --coverage
```

---

## API Overview

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | /api/auth/signup | No | — |
| POST | /api/auth/login | No | — |
| GET | /api/tasks | Yes | user+ |
| POST | /api/tasks | Yes | user+ |
| PUT | /api/tasks/:id | Yes | owner |
| DELETE | /api/tasks/:id | Yes | owner |
| PATCH | /api/tasks/:id/toggle | Yes | owner |
| GET | /api/admin/tasks | Yes | admin |
| DELETE | /api/admin/tasks/:id | Yes | admin |

Full documentation with request/response schemas available at `/api/docs` when the backend is running.

---

## Deployment

### Backend — Render
See `render.yaml` at repo root. Set these env vars in the Render dashboard:
- `MONGODB_URI` — MongoDB Atlas connection string
- `CLIENT_URL` — Vercel frontend URL (e.g. `https://taskflow-app.vercel.app`)

### Frontend — Vercel
See `frontend/vercel.json`. Set this env var in Vercel project settings:
- `VITE_API_BASE_URL` — Render backend URL (e.g. `https://taskflow-api.onrender.com/api`)

---

## Assumptions

1. A user's role is always `user` at signup. Admin users are seeded or manually assigned via DB.
2. Task `owner` is always set server-side from the JWT — clients cannot spoof ownership.
3. JWT is stored in `localStorage` (not HttpOnly cookies) — acceptable tradeoff for this scope.
4. Search is implemented via MongoDB `$regex` — acceptable for the scale of this assignment.
5. Password reset and email verification are out of scope.
6. Docker is explicitly excluded per project constraints.

---

## Author

**Ritik Sharma** — Full-Stack Software Engineer  
[GitHub](https://github.com/HrithikArya)
