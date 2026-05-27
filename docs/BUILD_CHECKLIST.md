# TaskFlow — Agent Build Checklist

Use this as your progress tracker. Check off each item as you complete it. Do NOT skip or reorder steps.

---

## Phase 0 — Monorepo Setup

- [ ] Create root `taskflow/` directory
- [ ] Create root `package.json` with workspaces config
- [ ] Create `.gitignore` (node_modules, dist, .env, coverage, logs)
- [ ] Create `.editorconfig`
- [ ] Create `.eslintrc.json` (root)
- [ ] Create `.prettierrc`
- [ ] Init git repo: `git init && git add . && git commit -m "chore: init monorepo"`

---

## Phase 1 — Backend

### 1.1 Scaffold
- [ ] `cd backend && npm init -y`
- [ ] Install all production + dev dependencies (see REQUIREMENTS.md)
- [ ] Create `tsconfig.json`
- [ ] Create `src/` directory structure (all folders from TECHNICAL_SPEC.md)
- [ ] Create `server.ts` (entry point — just starts express app)
- [ ] Create `src/app.ts` (express setup, middleware, routes — no listen)

### 1.2 Config
- [ ] `src/config/env.ts` — zod schema for env vars, export validated config
- [ ] `src/config/db.ts` — mongoose.connect with error handling + logger
- [ ] `backend/.env.example` (all vars without values)
- [ ] `backend/.env` (filled in locally)

### 1.3 Utils
- [ ] `src/utils/asyncHandler.ts`
- [ ] `src/utils/apiResponse.ts` — `success()`, `error()`, `paginated()`
- [ ] `src/utils/logger.ts` — winston with console + file transports

### 1.4 Models
- [ ] `src/models/user.model.ts` — with pre-save hash + comparePassword method
- [ ] `src/models/task.model.ts` — with indexes

### 1.5 Validators
- [ ] `src/validators/auth.validator.ts` — signup + login validation chains
- [ ] `src/validators/task.validator.ts` — create + update validation chains

### 1.6 Middleware
- [ ] `src/middleware/auth.middleware.ts` — verifyToken
- [ ] `src/middleware/role.middleware.ts` — requireRole
- [ ] `src/middleware/validate.middleware.ts` — runs validationResult
- [ ] `src/middleware/errorHandler.ts` — global error handler (last middleware)

### 1.7 Services
- [ ] `src/services/auth.service.ts` — signup, login, generateToken
- [ ] `src/services/task.service.ts` — getTasks (with pagination/filter/search), createTask, updateTask, deleteTask, toggleStatus

### 1.8 Controllers
- [ ] `src/controllers/auth.controller.ts` — signup, login (calls service, returns response)
- [ ] `src/controllers/task.controller.ts` — all task CRUD endpoints
- [ ] `src/controllers/admin.controller.ts` — getAllTasks, deleteAnyTask

### 1.9 Routes
- [ ] `src/routes/auth.routes.ts` — POST /signup, POST /login (+ Swagger JSDoc)
- [ ] `src/routes/task.routes.ts` — all task routes (+ Swagger JSDoc)
- [ ] `src/routes/admin.routes.ts` — admin routes (+ Swagger JSDoc)

### 1.10 Swagger
- [ ] `src/swagger/swagger.ts` — swagger-jsdoc config with API info + Bearer auth
- [ ] Mount swagger-ui-express at `/api/docs` in app.ts
- [ ] Verify Swagger UI loads and shows all routes

### 1.11 Health Check
- [ ] `GET /api/health` route in app.ts

### 1.12 Tests
- [ ] `jest.config.ts`
- [ ] `src/tests/auth.test.ts` — test signup, login, validation errors, duplicate email
- [ ] `src/tests/task.test.ts` — test CRUD, ownership checks, filters, pagination
- [ ] `src/tests/admin.test.ts` — test admin routes, 403 for non-admin
- [ ] Run `npm test` — all green ✅

### 1.13 Backend Verification
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] Manual test with Postman/curl: signup → login → CRUD → admin

---

## Phase 2 — Frontend

### 2.1 Scaffold
- [ ] `cd frontend && npm create vite@latest . -- --template react-ts`
- [ ] Install all dependencies (see REQUIREMENTS.md)
- [ ] Configure Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`)
- [ ] Update `src/index.css` with CSS variables from UI_SPEC.md
- [ ] Set up path alias `@/` in `vite.config.ts` and `tsconfig.json`

### 2.2 Types
- [ ] `src/types/auth.types.ts` — User, AuthState, LoginDto, SignupDto
- [ ] `src/types/task.types.ts` — Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority, PaginatedResponse, TaskQueryParams

### 2.3 Utils
- [ ] `src/utils/cn.ts` — clsx + tailwind-merge helper
- [ ] `src/utils/formatDate.ts` — format, isOverdue, relative time helpers

### 2.4 Store
- [ ] `src/app/store.ts` — configureStore with RTK Query reducer + middleware
- [ ] `src/api/taskApi.ts` — all RTK Query endpoints with cache tags

### 2.5 Context
- [ ] `src/context/AuthContext.tsx` — provider with login, signup, logout, user state
- [ ] localStorage persistence + hydration on mount

### 2.6 Hooks
- [ ] `src/hooks/useAuth.ts`
- [ ] `src/hooks/useDebounce.ts`
- [ ] `src/hooks/useDarkMode.ts`

### 2.7 UI Primitives (`src/components/ui/`)
- [ ] `Button.tsx` — variants: primary, ghost, danger, icon
- [ ] `Input.tsx` — with label, error message, icon slot
- [ ] `Modal.tsx` — overlay + panel, close on backdrop click/Escape
- [ ] `Badge.tsx` — priority badges
- [ ] `Skeleton.tsx` — animated placeholder blocks
- [ ] `Toast.tsx` — configure react-hot-toast with dark theme
- [ ] `Spinner.tsx` — loading spinner

### 2.8 Layout Components (`src/components/layout/`)
- [ ] `Navbar.tsx` — logo, search bar, dark mode toggle, user menu (logout)
- [ ] `Sidebar.tsx` — desktop sidebar + mobile drawer
- [ ] `ProtectedRoute.tsx` — redirects to /login if not authenticated
- [ ] `AdminRoute.tsx` — redirects to /dashboard if not admin

### 2.9 Auth Components (`src/components/auth/`)
- [ ] `LoginForm.tsx` — email + password, react-hook-form + zod, submit calls AuthContext.login
- [ ] `SignupForm.tsx` — name + email + password + confirm, validation, calls AuthContext.signup

### 2.10 Task Components (`src/components/task/`)
- [ ] `TaskStats.tsx` — total/pending/completed counts from API data
- [ ] `TaskFilters.tsx` — All/Pending/Completed tab buttons, synced to URL params
- [ ] `TaskSearch.tsx` — debounced search input, synced to URL params
- [ ] `TaskCard.tsx` — displays single task with edit/delete/toggle actions
- [ ] `TaskList.tsx` — maps tasks to TaskCards, shows skeleton/empty state
- [ ] `TaskForm.tsx` — create + edit modal form (react-hook-form + zod)

### 2.11 Pages
- [ ] `src/pages/LoginPage.tsx` — two-panel layout
- [ ] `src/pages/SignupPage.tsx` — two-panel layout
- [ ] `src/pages/DashboardPage.tsx` — full dashboard with all task components
- [ ] `src/pages/AdminPage.tsx` — admin-only view of all tasks

### 2.12 App Shell
- [ ] `src/App.tsx` — React Router routes, Provider wrappers, Toaster
- [ ] `src/main.tsx` — mount with StrictMode, Redux Provider, AuthProvider

### 2.13 Tests
- [ ] `src/tests/setup.ts` — vitest globals, @testing-library/jest-dom, MSW setup
- [ ] `src/tests/mocks/handlers.ts` — MSW request handlers for API
- [ ] `src/tests/LoginForm.test.tsx` — renders, validates, submits
- [ ] `src/tests/TaskCard.test.tsx` — renders task data, calls handlers
- [ ] `src/tests/TaskForm.test.tsx` — create mode, edit mode, validation
- [ ] `src/tests/ProtectedRoute.test.tsx` — redirects when not authenticated
- [ ] Run `npm test` — all green ✅

### 2.14 Frontend Verification
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] Manual browser test: full happy path

---

## Phase 3 — Integration & Polish

- [ ] Test signup → login → create → edit → delete → toggle end-to-end
- [ ] Test admin login → see all tasks → delete any task
- [ ] Test pagination: create 15+ tasks, verify pages
- [ ] Test search: verify debounce + correct results
- [ ] Test dark/light mode toggle persists on refresh
- [ ] Test on mobile viewport (375px) — no overflow, readable UI
- [ ] Test form validation — all error messages appear correctly
- [ ] Test API error handling — verify toasts show on network errors
- [ ] Test 401 flow — expired/missing token redirects to login
- [ ] Verify Swagger UI shows all routes with correct schemas

---

## Phase 4 — Deployment

- [ ] Create MongoDB Atlas free cluster
- [ ] Get connection string, update Render env vars
- [ ] Push to GitHub
- [ ] Deploy backend to Render — verify health check
- [ ] Deploy frontend to Vercel — verify build
- [ ] Update `VITE_API_BASE_URL` in Vercel to Render URL
- [ ] Update `CLIENT_URL` in Render to Vercel URL (for CORS)
- [ ] Test full flow on production URLs
- [ ] Seed admin user in production DB
- [ ] Update README with live URLs + deployment instructions

---

## Final Submission Checklist

- [ ] GitHub repo is public
- [ ] `README.md` is complete (from README_TEMPLATE.md)
- [ ] `.env` files are NOT committed (only `.env.example`)
- [ ] `npm test` passes in both workspaces
- [ ] Live demo URL works
- [ ] Swagger docs URL works
- [ ] Admin account credentials documented in README (or seed script)
