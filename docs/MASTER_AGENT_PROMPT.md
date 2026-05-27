# TaskFlow — Master Agent Prompt

## Mission

You are a senior full-stack engineer building **TaskFlow**, a production-grade Task Management Web Application. This is a technical assignment submission for a Full Stack Developer role (2–4 years experience level). Every decision must reflect **clean architecture, scalability, maintainability, and best practices**.

You will build this end-to-end: backend API → database → frontend → tests → documentation → deployment config. Follow the file structure and specifications exactly. Do not skip steps. Do not take shortcuts on code quality.

---

## Tech Stack (Non-negotiable)

| Layer | Choice |
|---|---|
| Frontend | React.js (Vite), TypeScript |
| Styling | Tailwind CSS v3 + custom CSS vars |
| State – Auth | React Context API |
| State – Tasks | Redux Toolkit + RTK Query |
| Backend | Node.js + Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (access token) + bcrypt |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |
| Deployment | Render (backend) + Vercel (frontend) |
| Linting | ESLint + Prettier |

> Docker is explicitly excluded.

---

## Roles & RBAC

Two roles exist:
- **admin** — can see all users' tasks, delete any task, access `/api/admin/*` routes
- **user** — can only CRUD their own tasks

Role is stored on the User document and embedded in the JWT payload.

---

## Execution Order

Build in this exact order. Complete each phase before moving to the next.

### Phase 0 — Repo & Tooling Setup
1. Init monorepo root with two workspaces: `/backend` and `/frontend`
2. Create root `.gitignore`, `.editorconfig`, root `README.md` (placeholder)
3. Set up ESLint + Prettier configs at root level

### Phase 1 — Backend
Follow `TECHNICAL_SPEC.md` → Backend section exactly.
1. Scaffold Express app with TypeScript (`tsconfig.json`, `nodemon`, `ts-node`)
2. Connect Mongoose to MongoDB Atlas (env-driven URI)
3. Create Models: `User`, `Task`
4. Create all API routes per `API_REFERENCE.md`
5. Implement JWT middleware, role guard middleware
6. Add Swagger annotations to every route
7. Write unit + integration tests for all routes

### Phase 2 — Frontend
Follow `TECHNICAL_SPEC.md` → Frontend section exactly.
1. Scaffold Vite + React + TypeScript
2. Set up Tailwind CSS + dark mode (`class` strategy)
3. Set up Redux store + RTK Query `taskApi`
4. Set up AuthContext
5. Build pages: Login, Signup, Dashboard, TaskDetail (modal)
6. Build components per component tree in `TECHNICAL_SPEC.md`
7. Wire RTK Query to all task CRUD actions
8. Implement dark mode toggle (persisted in localStorage)
9. Write component tests

### Phase 3 — Integration & Polish
1. Validate all API integrations end-to-end
2. Ensure responsive layout (mobile-first)
3. Add loading skeletons, error boundaries, toast notifications
4. Finalize form validations (react-hook-form + zod)

### Phase 4 — Docs & Deployment
1. Complete `README.md` per the template in `README_TEMPLATE.md`
2. Add `render.yaml` for backend deployment
3. Add `vercel.json` for frontend deployment
4. Verify Swagger UI loads at `/api/docs`

---

## Code Quality Rules

- **No `any` types in TypeScript** — use proper interfaces/types
- **No inline styles** — Tailwind only (or CSS vars for theme tokens)
- **All async Express handlers** must use `try/catch` or a `asyncHandler` wrapper
- **All Mongoose queries** must handle errors explicitly
- **No hardcoded secrets** — use `.env` via `dotenv`, validate with `envalid` or `zod`
- **Consistent naming**: camelCase for variables/functions, PascalCase for components/classes, SCREAMING_SNAKE for env vars
- **Reusable components only** — no copy-paste UI blocks
- **Every API response** must follow the standard envelope:
  ```json
  { "success": true, "data": {}, "message": "..." }
  { "success": false, "error": "...", "message": "..." }
  ```

---

## Environment Variables

### Backend (`/backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`/frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## What NOT to Do

- Do not use `create-react-app` — use **Vite**
- Do not use `var` — use `const`/`let`
- Do not use class components — use **functional components + hooks**
- Do not commit `.env` files — only `.env.example`
- Do not use `console.log` in production code — use a logger (winston or pino)
- Do not skip error handling on any route
- Do not mix concerns — controllers stay thin, business logic goes in services

---

## Definition of Done

A phase is complete when:
- All code compiles with zero TypeScript errors
- All linting passes with zero errors
- All tests pass
- All API routes are documented in Swagger
- The feature works end-to-end in the browser
