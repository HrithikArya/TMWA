# TaskFlow — API Reference

**Base URL (dev)**: `http://localhost:5000/api`  
**Base URL (prod)**: `https://taskflow-api.onrender.com/api`  
**Auth**: Bearer Token — `Authorization: Bearer <jwt_token>`

---

## Standard Response Envelope

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

### Paginated Success
```json
{
  "success": true,
  "message": "Tasks fetched",
  "data": {
    "tasks": [],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Human-readable error",
  "error": "ERROR_CODE or validation details"
}
```

---

## Auth Routes (`/api/auth`)

### POST `/api/auth/signup`

Register a new user account.

**Auth required**: No

**Request Body**
```json
{
  "name": "Ritik Sharma",
  "email": "ritik@example.com",
  "password": "StrongPass@123"
}
```

**Validation**
- `name`: required, 2–50 chars
- `email`: required, valid email format
- `password`: required, min 8 chars, must contain uppercase + number

**Response `201`**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "_id": "664abc...",
      "name": "Ritik Sharma",
      "email": "ritik@example.com",
      "role": "user",
      "createdAt": "2026-05-27T10:00:00.000Z"
    }
  }
}
```

**Errors**
| Status | Scenario |
|---|---|
| 400 | Validation failed |
| 409 | Email already exists |

---

### POST `/api/auth/login`

Authenticate an existing user.

**Auth required**: No

**Request Body**
```json
{
  "email": "ritik@example.com",
  "password": "StrongPass@123"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "_id": "664abc...",
      "name": "Ritik Sharma",
      "email": "ritik@example.com",
      "role": "user"
    }
  }
}
```

**Errors**
| Status | Scenario |
|---|---|
| 400 | Validation failed |
| 401 | Invalid email or password |

---

## Task Routes (`/api/tasks`)

All routes require `Authorization: Bearer <token>`.

---

### GET `/api/tasks`

Get tasks for the authenticated user with filtering, search, and pagination.

**Auth required**: Yes (any role)

**Query Parameters**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `status` | string | `all` | `all` \| `pending` \| `completed` |
| `priority` | string | — | `low` \| `medium` \| `high` |
| `q` | string | — | Search in title + description |
| `sortBy` | string | `createdAt` | `createdAt` \| `dueDate` \| `priority` |
| `order` | string | `desc` | `asc` \| `desc` |

**Example**: `GET /api/tasks?page=2&status=pending&q=fix&sortBy=dueDate&order=asc`

**Response `200`**
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "_id": "665xyz...",
        "title": "Fix login bug",
        "description": "JWT not expiring correctly",
        "status": "pending",
        "priority": "high",
        "dueDate": "2026-06-01T00:00:00.000Z",
        "owner": { "_id": "664abc...", "name": "Ritik Sharma" },
        "createdAt": "2026-05-27T10:00:00.000Z",
        "updatedAt": "2026-05-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### POST `/api/tasks`

Create a new task.

**Auth required**: Yes

**Request Body**
```json
{
  "title": "Fix login bug",
  "description": "JWT not expiring correctly",
  "priority": "high",
  "dueDate": "2026-06-01"
}
```

**Validation**
- `title`: required, 1–100 chars
- `description`: optional, max 500 chars
- `priority`: optional, enum `low|medium|high` (default: `medium`)
- `dueDate`: optional, valid ISO date string, must be today or future
- `status` is always set to `pending` on creation (not client-controlled)
- `owner` is always set from `req.user.id` (never from body)

**Response `201`**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": { ...taskObject }
  }
}
```

**Errors**
| Status | Scenario |
|---|---|
| 400 | Validation failed |
| 401 | Not authenticated |

---

### GET `/api/tasks/:id`

Get a single task by ID.

**Auth required**: Yes  
**Ownership**: User must own the task (or be admin)

**Response `200`**
```json
{
  "success": true,
  "message": "Task fetched",
  "data": { "task": { ...taskObject } }
}
```

**Errors**
| Status | Scenario |
|---|---|
| 400 | Invalid ObjectId format |
| 403 | Task belongs to another user |
| 404 | Task not found |

---

### PUT `/api/tasks/:id`

Update a task's fields.

**Auth required**: Yes  
**Ownership**: Must own the task

**Request Body** (all fields optional)
```json
{
  "title": "Updated title",
  "description": "New description",
  "priority": "low",
  "dueDate": "2026-07-15",
  "status": "completed"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { "task": { ...updatedTask } }
}
```

**Errors**
| Status | Scenario |
|---|---|
| 400 | Validation failed |
| 403 | Not task owner |
| 404 | Task not found |

---

### DELETE `/api/tasks/:id`

Delete a task.

**Auth required**: Yes  
**Ownership**: Must own the task (admins use `/admin/tasks/:id`)

**Response `200`**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

**Errors**
| Status | Scenario |
|---|---|
| 403 | Not task owner |
| 404 | Task not found |

---

### PATCH `/api/tasks/:id/toggle`

Toggle task status between `pending` and `completed`.

**Auth required**: Yes  
**Ownership**: Must own the task

**No request body required.**

**Response `200`**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": { "task": { ...task, "status": "completed" } }
}
```

---

## Admin Routes (`/api/admin`)

All routes require `Authorization: Bearer <token>` with `role: admin`.

---

### GET `/api/admin/tasks`

Get all tasks across all users (paginated + filterable).

**Auth required**: Yes — Admin only

**Query Parameters**: Same as `GET /api/tasks` plus:
| Param | Type | Description |
|---|---|---|
| `userId` | string | Filter tasks by a specific user ID |

**Response `200`**
```json
{
  "success": true,
  "message": "All tasks fetched",
  "data": {
    "tasks": [
      {
        ...taskObject,
        "owner": { "_id": "...", "name": "...", "email": "..." }
      }
    ],
    "pagination": { ... }
  }
}
```

---

### DELETE `/api/admin/tasks/:id`

Delete any task regardless of ownership.

**Auth required**: Yes — Admin only

**Response `200`**
```json
{
  "success": true,
  "message": "Task deleted by admin",
  "data": null
}
```

---

## Error Reference

| Code | Status | Description |
|---|---|---|
| Validation errors | 400 | Body/param validation failed |
| `INVALID_ID` | 400 | MongoDB ObjectId format invalid |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Duplicate resource (e.g. email) |
| `SERVER_ERROR` | 500 | Unexpected server error |

---

## Swagger UI

Interactive documentation available at:  
**`GET /api/docs`** — No auth required

Includes "Authorize" button to set Bearer token for testing protected endpoints.
