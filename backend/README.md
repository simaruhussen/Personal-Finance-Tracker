# Personal Finance Tracker — Backend

This is the backend API for the Personal Finance Tracker application. It provides authentication, transaction CRUD, and summary endpoints backed by Prisma + PostgreSQL.

## Features
- JWT-based auth (register / login)
- Transaction CRUD (create, read, update, delete)
- Summary endpoint (income, expenses, balance, category totals)
- Input validation with Zod
- Swagger/OpenAPI docs configured

## Prerequisites
- Node.js (recommended >= 18)
- PostgreSQL
- npm

## Quickstart (development)

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` in `backend/` with at least:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   JWT_SECRET="a-strong-secret"
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   ```
3. Generate Prisma client and run migrations (if any)
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start in dev mode
   ```bash
   npm run dev
   ```

## Production
- Build:
  ```bash
  npm run build
  ```
- Start:
  ```bash
  npm start
  ```

## Scripts
- `dev` - run in watch/dev mode (uses tsx)
- `build` - TypeScript build
- `start` - run built server
- `test` - run tests

## Database schema (high level)
- `User` (id, fullName, email, passwordHash, createdAt)
- `Transaction` (id, amount, type [INCOME|EXPENSE], category, description?, date, userId)

See `backend/prisma/schema.prisma` for full model definitions.

## Important environment variables
- `DATABASE_URL` — Postgres connection string used by Prisma  
- `JWT_SECRET` — secret for signing access tokens  
- `PORT` — server port (default in app if set)  
- `CORS_ORIGIN` — origin allowed for CORS

## API Endpoints (summary)
- `POST /api/auth/register` — register new user  
- `POST /api/auth/login` — login, returns JWT  
- `POST /api/transactions` — create transaction (auth required)  
- `GET /api/transactions` — list transactions for current user (auth required)  
- `PUT /api/transactions/:id` — update transaction (owner only)  
- `DELETE /api/transactions/:id` — delete transaction (owner only)  
- `GET /api/summary` — get totals and category breakdown (auth required)

Swagger/OpenAPI docs are configured in the codebase (see `backend/src/swagger.js` / `setupSwagger`) — check that file to find the UI path for docs in your environment.

## Logging & Errors
- Uses `morgan` for request logging in dev and a centralized error handler.

## Notes
- Validation is performed with Zod; controllers will return standard HTTP error codes for validation/auth errors.
- If you want a Docker setup, the root repository contains `docker-compose.yml` that can be used as a starting point.

## Contributing
- Run tests with `npm test` and keep typescript errors clean. Follow existing code style for imports and async error handling.

