# TaskFlow — Technical Specification

---

## 1. Monorepo Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts               # Mongoose connection
│   │   │   └── env.ts              # Validated env vars (zod)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # verifyToken
│   │   │   ├── role.middleware.ts   # requireRole('admin')
│   │   │   ├── validate.middleware.ts # express-validator runner
│   │   │   └── errorHandler.ts     # Global error handler
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   └── task.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── validators/
│   │   │   ├── auth.validator.ts
│   │   │   └── task.validator.ts
│   │   ├── utils/
│   │   │   ├── asyncHandler.ts
│   │   │   ├── apiResponse.ts
│   │   │   └── logger.ts           # winston logger
│   │   ├── swagger/
│   │   │   └── swagger.ts          # swagger-jsdoc config
│   │   ├── tests/
│   │   │   ├── auth.test.ts
│   │   │   ├── task.test.ts
│   │   │   └── admin.test.ts
│   │   └── app.ts                  # Express app (no listen)
│   ├── server.ts                   # Entry point (listen)
│   ├── jest.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.ts          # RTK Query endpoints
│   │   ├── app/
│   │   │   └── store.ts            # Redux store
│   │   ├── components/
│   │   │   ├── ui/                 # Primitive reusable components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx     # mobile drawer
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── task/
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskForm.tsx    # Create + Edit (shared)
│   │   │   │   ├── TaskFilters.tsx
│   │   │   │   ├── TaskSearch.tsx
│   │   │   │   └── TaskStats.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── SignupForm.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # consumes AuthContext
│   │   │   ├── useDebounce.ts
│   │   │   └── useDarkMode.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── types/
│   │   │   ├── task.types.ts
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   └── cn.ts               # clsx + tailwind-merge
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── .editorconfig
├── README.md
└── package.json                    # root (workspaces)
```

---

## 2. Backend — Detailed Spec

### 2.1 Models

#### User Model (`user.model.ts`)
```typescript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  timestamps: true
}
```
- Pre-save hook: hash password with `bcrypt` (cost 12)
- Instance method: `comparePassword(candidate): Promise<boolean>`
- Never return `password` in any response (use `.select('-password')`)

#### Task Model (`task.model.ts`)
```typescript
{
  title: { type: String, required: true, maxlength: 100, trim: true },
  description: { type: String, maxlength: 500, default: '' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamps: true
}
```
- Index on `owner` for fast user-scoped queries
- Index on `status` for filter queries
- Compound index on `owner + status` for filtered views

### 2.2 Middleware

#### `auth.middleware.ts`
```typescript
// Extracts JWT from Authorization header
// Verifies with JWT_SECRET
// Attaches decoded payload to req.user: { id, email, role }
// Returns 401 if missing or invalid
```

#### `role.middleware.ts`
```typescript
// requireRole('admin') — returns 403 if req.user.role !== 'admin'
// Must be chained AFTER verifyToken
```

#### `errorHandler.ts` (global)
```typescript
// Catches all errors passed to next(err)
// Mongoose ValidationError → 400
// Mongoose CastError (invalid ObjectId) → 400
// JWT errors → 401
// Custom AppError class with statusCode
// Default → 500
// Always responds with: { success: false, error: string, message: string }
```

### 2.3 Services Pattern

Controllers stay thin — they call services, return response.

```typescript
// task.service.ts
getTasks(userId, role, { page, limit, status, search }): Promise<PaginatedResult>
createTask(userId, dto): Promise<Task>
updateTask(taskId, userId, role, dto): Promise<Task>
deleteTask(taskId, userId, role): Promise<void>
toggleStatus(taskId, userId): Promise<Task>
```

### 2.4 Utilities

#### `asyncHandler.ts`
```typescript
// Wraps async route handlers to catch errors automatically
// Eliminates try/catch boilerplate in controllers
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);
```

#### `apiResponse.ts`
```typescript
// success(res, data, message, statusCode = 200)
// error(res, message, statusCode = 500)
// paginated(res, data, page, limit, total)
```

### 2.5 Swagger Setup

- Config in `src/swagger/swagger.ts`
- JSDoc `@swagger` annotations on every route file
- Mounted at `GET /api/docs` via `swagger-ui-express`
- Includes Bearer token auth scheme (Authorize button in UI)

### 2.6 Logging

Use `winston` with:
- Console transport (dev): colorized, timestamp
- File transports (prod): `logs/error.log` + `logs/combined.log`
- Replace all `console.log/error` calls with `logger.info/error`

### 2.7 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);
```

---

## 3. Frontend — Detailed Spec

### 3.1 Auth Flow (Context API)

```typescript
// AuthContext provides:
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

- Token persisted in `localStorage` under key `tf_token`
- User object persisted under `tf_user`
- On app load: read from localStorage, validate (check expiry), hydrate context
- `ProtectedRoute` reads `isAuthenticated` — redirect to `/login` if false
- `AdminRoute` reads `isAdmin` — redirect to `/dashboard` if not admin

### 3.2 Redux Store (Task Data)

```typescript
// store.ts
{
  [taskApi.reducerPath]: taskApi.reducer   // RTK Query cache
}

// taskApi.ts (RTK Query)
endpoints:
  - getTasks(params: TaskQueryParams)      // GET /tasks
  - getTask(id: string)                    // GET /tasks/:id
  - createTask(dto: CreateTaskDto)         // POST /tasks
  - updateTask({ id, ...dto })             // PUT /tasks/:id
  - deleteTask(id: string)                 // DELETE /tasks/:id
  - toggleStatus(id: string)              // PATCH /tasks/:id/toggle
  - getAdminTasks(params)                  // GET /admin/tasks
  - adminDeleteTask(id: string)            // DELETE /admin/tasks/:id
```

RTK Query handles:
- Automatic cache invalidation on mutations (tag-based: `'Task'`)
- Loading/error/success states via `isLoading`, `isError`, `data`
- Prefetching not needed for this scope

### 3.3 Form Handling

Use `react-hook-form` + `zod` resolver for all forms.

```typescript
// Example task schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});
```

### 3.4 Dark Mode

- Tailwind `darkMode: 'class'` strategy
- `useDarkMode` hook toggles `dark` class on `<html>`
- Persisted to `localStorage` under `tf_theme`
- Default: `dark`

### 3.5 Pagination & Search

- URL-synced query params: `?page=1&status=all&q=`
- `useSearchParams` from react-router-dom
- Search debounced 300ms via `useDebounce` hook
- Page size: 10 items per page
- Pagination controls: Prev / [1] [2] [3] / Next

### 3.6 Component Contracts

#### `TaskCard`
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isAdmin?: boolean;
}
```

#### `TaskForm` (create + edit, same component)
```typescript
interface TaskFormProps {
  task?: Task;           // if provided → edit mode
  onSuccess: () => void;
  onClose: () => void;
}
```

#### `TaskFilters`
```typescript
interface TaskFiltersProps {
  activeFilter: 'all' | 'pending' | 'completed';
  onChange: (filter: string) => void;
}
```

---

## 4. API Contract Summary

Full details in `API_REFERENCE.md`. Summary:

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | /api/auth/signup | No | Any |
| POST | /api/auth/login | No | Any |
| GET | /api/tasks | Yes | user+ |
| POST | /api/tasks | Yes | user+ |
| PUT | /api/tasks/:id | Yes | owner |
| DELETE | /api/tasks/:id | Yes | owner |
| PATCH | /api/tasks/:id/toggle | Yes | owner |
| GET | /api/admin/tasks | Yes | admin |
| DELETE | /api/admin/tasks/:id | Yes | admin |
| GET | /api/docs | No | Any |

---

## 5. Testing Strategy

### Backend (Jest + Supertest)
- Use in-memory MongoDB (`mongodb-memory-server`)
- Test each route: happy path + error cases
- `beforeAll`: connect DB, seed test users
- `afterAll`: disconnect DB
- `beforeEach`: clean collections

### Frontend (Vitest + RTL)
- Mock RTK Query hooks with `msw` (Mock Service Worker)
- Test: `LoginForm` validation, `TaskCard` renders, `TaskForm` submit
- Test: `ProtectedRoute` redirects unauthenticated user

---

## 6. Deployment

### Backend — Render
- Service type: Web Service
- Build command: `npm install && npm run build`
- Start command: `node dist/server.js`
- Env vars set in Render dashboard
- Add `render.yaml` to repo root

### Frontend — Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output dir: `dist`
- Env vars: `VITE_API_BASE_URL` pointing to Render URL
- Add `vercel.json` for SPA fallback routing

---

## 7. Key Dependencies

### Backend
```json
{
  "express": "^4.18",
  "mongoose": "^8",
  "jsonwebtoken": "^9",
  "bcryptjs": "^2.4",
  "express-validator": "^7",
  "express-rate-limit": "^7",
  "cors": "^2.8",
  "helmet": "^7",
  "winston": "^3",
  "swagger-jsdoc": "^6",
  "swagger-ui-express": "^5",
  "dotenv": "^16",
  "zod": "^3"
}
```

### Backend Dev
```json
{
  "typescript": "^5",
  "ts-node": "^10",
  "nodemon": "^3",
  "jest": "^29",
  "supertest": "^6",
  "@types/express": "^4",
  "@types/jest": "^29",
  "mongodb-memory-server": "^9"
}
```

### Frontend
```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "@reduxjs/toolkit": "^2",
  "react-redux": "^9",
  "react-hook-form": "^7",
  "@hookform/resolvers": "^3",
  "zod": "^3",
  "clsx": "^2",
  "tailwind-merge": "^2",
  "react-hot-toast": "^2",
  "date-fns": "^3"
}
```

### Frontend Dev
```json
{
  "vite": "^5",
  "@vitejs/plugin-react": "^4",
  "tailwindcss": "^3",
  "autoprefixer": "^10",
  "vitest": "^1",
  "@testing-library/react": "^14",
  "@testing-library/user-event": "^14",
  "msw": "^2",
  "typescript": "^5"
}
```
