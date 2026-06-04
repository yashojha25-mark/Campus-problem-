# Campus Problems Backend Authentication API

This backend uses Node.js, Express.js, MongoDB, and Mongoose with MVC structure.

## What Each File Does

- `server.js` starts the app and connects all routes.
- `config/db.js` connects the backend to MongoDB Atlas.
- `models/User.js` defines how user data is stored.
- `controllers/authController.js` handles signup, login, profile, and logout logic.
- `middleware/authMiddleware.js` checks whether a request has a valid JWT token.
- `routes/authRoutes.js` connects URLs to controller functions.

## Folder Structure

```text
Backend/
  config/
    db.js
  controllers/
    authController.js
  middleware/
    authMiddleware.js
  models/
    User.js
  routes/
    authRoutes.js
  .env
  package.json
  server.js
```

## Install Packages

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator
npm install --save-dev nodemon
```

## Run the Server

```bash
npm run dev
```

## Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Frontend Logout Note

JWT logout is handled on the client side. After calling `/api/auth/logout`, remove the token from localStorage, sessionStorage, or cookies on the frontend.