# TaskFlow — Deployment Configuration

---

## render.yaml (place in repo root)

```yaml
services:
  - type: web
    name: taskflow-api
    env: node
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: node dist/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false          # Set manually in Render dashboard
      - key: JWT_SECRET
        sync: false          # Set manually in Render dashboard
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CLIENT_URL
        value: https://taskflow-app.vercel.app
    healthCheckPath: /api/health
    autoDeploy: true
```

---

## vercel.json (place in /frontend)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://taskflow-api.onrender.com/api"
  }
}
```

> The `rewrites` rule is critical — without it, refreshing any non-root route on Vercel returns 404 because Vercel tries to find a file at that path. This tells it to always serve `index.html` and let React Router handle routing.

---

## Health Check Endpoint

Add this to `app.ts` so Render knows the server is alive:

```typescript
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});
```

---

## Environment Variables — Render Dashboard Setup

Go to: Render Dashboard → Your Service → Environment

Add these secrets manually (never commit to repo):

| Key | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random 64-char string (use `openssl rand -base64 64`) |

---

## MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user (username + strong password)
3. Add `0.0.0.0/0` to IP whitelist (or Render's static IPs if on paid plan)
4. Connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```

---

## Post-Deployment Checklist

- [ ] Backend health check responds: `GET https://taskflow-api.onrender.com/api/health`
- [ ] Swagger UI loads: `GET https://taskflow-api.onrender.com/api/docs`
- [ ] CORS allows Vercel domain (set `CLIENT_URL` env var correctly)
- [ ] Frontend loads and can sign up/login
- [ ] Task CRUD works end-to-end on production
- [ ] Admin user exists in production DB (run seed script against Atlas)
