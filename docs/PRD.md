# TaskFlow — Product Requirements Document (PRD)

**Version**: 1.0  
**Author**: Ritik  
**Date**: May 2026  
**Assignment**: Full Stack Developer — Take-Home (48hrs)

---

## 1. Overview

TaskFlow is a full-stack task management web application. It enables authenticated users to create, organize, and track tasks through a clean, responsive UI. An admin role provides elevated control over all platform tasks.

The application demonstrates full-stack proficiency across React.js, Node.js/Express, MongoDB, JWT authentication, RBAC, and deployment.

---

## 2. Goals

| Goal | Description |
|---|---|
| Functional completeness | All core CRUD operations for tasks work reliably |
| Authentication | Secure JWT-based login/signup with protected routes |
| Role-based access | Admin can manage all tasks; users manage only their own |
| UX quality | Responsive, accessible, dark-mode-capable UI |
| Code quality | Clean architecture, TypeScript, proper error handling |
| Bonus coverage | Pagination, search, Swagger docs, unit tests, deployment |

---

## 3. User Personas

### 3.1 Regular User
- Signs up / logs in
- Creates tasks with title, description, priority, and due date
- Views their task dashboard, filtered by status
- Edits or deletes their tasks
- Marks tasks complete/pending

### 3.2 Admin User
- All user capabilities, plus:
- Views all tasks across all users
- Deletes any task on the platform
- Accesses admin-only dashboard panel

---

## 4. Feature Specifications

### 4.1 Authentication

| Feature | Details |
|---|---|
| Signup | Name, email, password (min 8 chars). Email must be unique. Returns JWT. |
| Login | Email + password. Returns JWT + user object (id, name, email, role). |
| JWT | Stored in `localStorage`. Sent as `Authorization: Bearer <token>` header. |
| Protected routes | Frontend redirects unauthenticated users to `/login`. Backend returns 401 on missing/invalid token. |
| Logout | Clears token from localStorage. Redirects to login. |
| Validation | Email format, password strength enforced client and server side. |

### 4.2 Task Management (Core CRUD)

Each task has:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | ✅ | Max 100 chars |
| `description` | String | ❌ | Max 500 chars |
| `status` | Enum | ✅ | `pending` \| `completed` |
| `priority` | Enum | ✅ | `low` \| `medium` \| `high` |
| `dueDate` | Date | ❌ | ISO string |
| `owner` | ObjectId (ref User) | ✅ | Set server-side from JWT |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

**Operations:**
- Create task (authenticated users)
- Read own tasks (users) / all tasks (admin)
- Update task fields or status
- Delete task (own only for users, any for admin)
- Toggle status (Pending ↔ Completed) with single click

### 4.3 Dashboard & Filtering

| Feature | Details |
|---|---|
| Task list | Paginated (10 per page), sorted by `createdAt` desc by default |
| Filter tabs | All / Pending / Completed |
| Search | Full-text search on `title` and `description` (debounced, 300ms) |
| Priority badge | Color-coded: High=red, Medium=amber, Low=green |
| Due date indicator | Overdue tasks highlighted |
| Stats bar | Total / Pending / Completed count shown at top of dashboard |

### 4.4 Role-Based Access Control

| Action | User | Admin |
|---|---|---|
| View own tasks | ✅ | ✅ |
| View all tasks | ❌ | ✅ |
| Create task | ✅ | ✅ |
| Edit own task | ✅ | ✅ |
| Delete own task | ✅ | ✅ |
| Delete any task | ❌ | ✅ |
| Access /admin panel | ❌ | ✅ |

### 4.5 UI / UX

| Feature | Details |
|---|---|
| Dark mode | Toggle persisted in localStorage. Default: dark. |
| Responsive | Mobile-first. Works on 320px+ screens. |
| Loading states | Skeleton loaders on task list, spinner on form submit |
| Toast notifications | Success/error feedback on all mutations |
| Form validation | Inline error messages. Disable submit until valid. |
| Empty states | Friendly illustrated empty state when no tasks exist |
| Animations | Subtle fade/slide on list items, modal open/close |

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API response time | < 200ms for list queries on local dev |
| JWT expiry | 7 days |
| Password hashing | bcrypt, cost factor 12 |
| CORS | Restricted to `CLIENT_URL` env var |
| Input sanitization | `express-validator` on all POST/PUT body inputs |
| Rate limiting | `express-rate-limit`: 100 req/15min per IP |
| Error format | Consistent JSON envelope on all errors |

---

## 6. Out of Scope

- Real-time updates (WebSockets)
- Email verification / password reset
- File attachments on tasks
- Team/workspace features
- Docker setup

---

## 7. Success Criteria

The assignment is considered complete and submission-ready when:

1. A user can sign up, log in, and see their dashboard
2. Full CRUD on tasks works without page refresh (RTK Query cache)
3. Filters and search work correctly
4. Admin user can see and delete all tasks
5. Dark mode toggles and persists
6. App is deployed and publicly accessible
7. Swagger docs load at `/api/docs`
8. Tests pass (`npm test` in both `/backend` and `/frontend`)
9. README is complete with setup instructions
