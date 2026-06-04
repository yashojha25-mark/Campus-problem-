# Campus Problems Backend API

Node.js + Express + MongoDB API for the campus complaint portal, admin dashboard, contact form, and file uploads.

## Setup

```bash
cd Backend
cp .env.example .env
npm install
```

Fill in `.env` (see variables below), then start:

```bash
npm run dev
```

Health check: `GET http://localhost:5000/api/health`

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for user and admin JWTs |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `CLIENT_ORIGIN` | Prod | Frontend URL for CORS (e.g. `https://your-app.com`) |
| `ADMIN_USERNAME` | Yes | Admin panel login username |
| `ADMIN_PASSWORD` | Yes | Admin panel login password |
| `EXPOSE_PASSWORD_RESET_TOKEN` | No | Set `true` in dev to return reset codes in API (no email service) |

## Scripts

- `npm run dev` — start with file watch
- `npm start` — production start

## API endpoints

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (JWT)
- `GET /api/auth/me` (JWT)
- `PATCH /api/auth/me` (JWT) — update name
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Complaints (JWT)

- `POST /api/complaints` — JSON or `multipart/form-data` with optional `photo`
- `GET /api/complaints/my`

### Feedback (JWT)

- `POST /api/feedback`
- `GET /api/feedback/my`

### Contact (public, optional JWT)

- `POST /api/contact`

### Admin (admin JWT)

- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/admin/overview`
- `GET /api/admin/complaints`
- `PATCH /api/admin/complaints/:id/status`
- `GET /api/admin/feedback`
- `GET /api/admin/users`
- `GET /api/admin/contact`
- `PATCH /api/admin/contact/:id/status`

Uploaded images are served from `/uploads/...`.

## Frontend (dev)

From `Frontend/`:

```bash
npm install
npm run dev
```

Vite (`http://localhost:5173`) proxies `/api` and `/uploads` to the backend.

For Live Server or static hosting, set before `api.js`:

```html
<script>window.CAMPUS_API_URL = 'http://localhost:5000';</script>
```

## Production notes

1. Set `NODE_ENV=production`, strong `JWT_SECRET`, and `CLIENT_ORIGIN` to your deployed frontend URL.
2. Set `EXPOSE_PASSWORD_RESET_TOKEN=false` and integrate email (SMTP) for password reset, or handle resets manually.
3. Persist the `Backend/uploads` directory or move uploads to object storage (S3, etc.).
4. Run the API behind HTTPS (reverse proxy). Serve the built frontend separately or from the same domain with correct `CAMPUS_API_URL`.

## Admin panel

Open `http://localhost:5000/admin` (or `http://localhost:5173/admin` via Vite) and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
