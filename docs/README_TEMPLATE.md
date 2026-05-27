# TaskFlow

> A full-stack Task Management Web Application built with React.js, Node.js/Express, and MongoDB.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://taskflow-app.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Swagger-blue)](https://taskflow-api.onrender.com/api/docs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3, Dark Mode |
| State (Auth) | React Context API |
| State (Data) | Redux Toolkit + RTK Query |
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
- ✅ User Signup & Login with JWT authentication
- ✅ Create, Read, Update, Delete tasks
- ✅ Mark tasks as Pending / Completed (one-click toggle)
- ✅ Filter tasks: All / Pending / Completed
- ✅ Responsive UI — mobile + desktop
- ✅ Dark mode (persisted in localStorage)

### Bonus
- ✅ Role-based access control (Admin / User)
- ✅ Pagination (10 per page) + Search (debounced)
- ✅ Unit & integration tests (Jest + Supertest + Vitest + RTL)
- ✅ Deployment (Render + Vercel)
- ✅ Swagger API documentation at `/api/docs`

---

## Project Structure

```
taskflow/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/       # DB connection, env validation
│   │   ├── controllers/  # Thin route handlers
│   │   ├── middleware/   # Auth, role guard, error handler
│   │   ├── models/       # Mongoose User + Task models
│   │   ├── routes/       # Express routers
│   │   ├── services/     # Business logic layer
│   │   ├── validators/   # express-validator schemas
│   │   ├── utils/        # asyncHandler, apiResponse, logger
│   │   ├── swagger/      # OpenAPI config
│   │   └── tests/        # Jest + Supertest test suites
│   └── server.ts
│
└── frontend/         # React + TypeScript + Vite SPA
    └── src/
        ├── api/          # RTK Query endpoints
        ├── app/          # Redux store
        ├── components/   # UI primitives + feature components
        ├── context/      # AuthContext
        ├── hooks/        # Custom hooks
        ├── pages/        # Route-level page components
        ├── types/        # Shared TypeScript types
        └── utils/        # Helpers
```

---

## Local Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Install Dependencies
```bash
npm install
```
> This installs dependencies for both workspaces (backend + frontend) via npm workspaces.

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

In two terminals:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Swagger Docs: http://localhost:5000/api/docs

### 5. Seed an Admin User

To create an admin account for testing, hit the signup endpoint and then manually update the role in MongoDB Atlas (or run the seed script):

```bash
cd backend && npx ts-node src/scripts/seed.ts
```

This creates:
- **Admin**: `admin@taskflow.com` / `Admin@12345`
- **User**: `user@taskflow.com` / `User@12345`

---

## Running Tests

```bash
# All tests
npm test

# Backend only
npm run test:backend

# Frontend only
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

Full documentation with request/response schemas: **[Swagger UI →](https://taskflow-api.onrender.com/api/docs)**

---

## Deployment

### Backend — Render
- Service type: Web Service
- Branch: `main`
- Build: `npm install && npm run build`
- Start: `node dist/server.js`
- Root directory: `backend`

### Frontend — Vercel
- Framework: Vite
- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env var: `VITE_API_BASE_URL` → Render URL

---

## Assumptions

1. A user's role is always `user` at signup. Admin users are seeded or manually assigned via DB.
2. Task `owner` is always set server-side from the JWT — clients cannot spoof ownership.
3. JWT is stored in `localStorage` (not HttpOnly cookies) — acceptable tradeoff for this scope.
4. Search is implemented via MongoDB `$regex` — acceptable for the scale of this assignment. In production, Elasticsearch or Atlas Search would be preferred.
5. Password reset and email verification are out of scope.
6. Docker is explicitly excluded per project constraints.

---

## Author

**Ritik Sharma** — Full-Stack Software Engineer  
[GitHub](https://github.com/your-username) · [LinkedIn](https://linkedin.com/in/your-profile)
