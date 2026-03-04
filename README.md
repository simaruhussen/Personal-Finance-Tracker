# Personal Finance Tracker

Personal Finance Tracker is a full-stack application for tracking income, expenses, accounts and generating simple summaries. The frontend is built with React + Vite + TypeScript and the backend is an Express API using Prisma + PostgreSQL.

This repository contains:
- `/` — frontend app (Vite + React + TypeScript)
- `/backend` — Express API (TypeScript) with Prisma and Swagger/OpenAPI docs
- `docker-compose.yml` — optional local PostgreSQL + backend service

Prerequisites
------------
- Node.js (recommended >= 18)
- npm
- PostgreSQL (or use Docker via `docker-compose.yml`)

Quick setup
-----------
1. Clone the repo

   ```bash
   git clone <repo-url>
   cd Personal-Finance-Tracker
   ```

2. Install dependencies (root and backend)

   ```bash
   # from project root
   npm install
   cd backend
   npm install
   cd ..
   ```

3. Create environment variables for the backend

   Copy or create `backend/.env` with at least:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   JWT_SECRET="a-strong-secret"
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   ```

4. Generate Prisma client and run migrations

   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   cd ..
   ```

Run locally
-----------
- Run frontend (development):

  ```bash
  # project root
  npm run dev
  # opens Vite dev server (Vite will show the port)
  ```

- Run backend (development):

  ```bash
  cd backend
  npm run dev
  ```

- Run everything with Docker (Postgres + backend)

  ```bash
  docker-compose up --build
  ```

Architecture overview
---------------------
- Frontend
  - Tech: React + TypeScript + Vite
  - State/data: React Query for server state
  - Routing: React Router
  - API client: Axios
  - Location: project root `src/`

- Backend
  - Tech: Express (TypeScript), Prisma ORM, PostgreSQL
  - Auth: JWT-based authentication (register / login)
  - Validation: Zod schemas
  - OpenAPI: Swagger UI available at `/api-docs`
  - Location: `backend/`

- Database
  - PostgreSQL (managed locally or via Docker)
  - Prisma schema in `backend/prisma/schema.prisma`

API documentation (summary)
---------------------------
The backend exposes these primary endpoints (see `backend/src/routes.ts` and `backend/README.md` for more detail):

- GET / — health/root (returns a small welcome message)

Auth
- POST /api/auth/register — register a new user
- POST /api/auth/login — login and receive a JWT

Transactions (authenticated)
- POST /api/transactions — create a transaction
- GET /api/transactions — list transactions for the authenticated user
- PUT /api/transactions/:id — update a transaction (owner only)
- DELETE /api/transactions/:id — delete a transaction (owner only)

Summary (authenticated)
- GET /api/summary — returns income/expense totals and category breakdowns

Accounts (authenticated)
- GET /api/accounts — fetch account balances (checking / savings / cash)
- PUT /api/accounts — upsert account balances

Authentication
--------------
- All protected endpoints require an Authorization header: `Authorization: Bearer <JWT>`

OpenAPI / Swagger
-----------------
- Swagger UI is mounted by the backend at `/api-docs` and the JSON spec at `/api-docs.json` (see `backend/src/swagger.ts`).

Database migrations
-------------------
- Use Prisma migrations:

  ```bash
  cd backend
  npx prisma migrate dev --name <migration-name>
  npx prisma generate
  ```

Useful scripts
--------------
- Root:
  - `npm run dev` — start frontend dev server (Vite)
  - `npm run build` — build the frontend

- Backend (`/backend`):
  - `npm run dev` — start backend in dev/watch mode
  - `npm run build` — compile TypeScript
  - `npm start` — run the built backend

Where to look next
------------------
- Backend detailed README: `backend/README.md` (contains env samples, endpoints summary, and Prisma info)
- Backend code: `backend/src/`
- Frontend code: `src/`

Contributing
------------
- Run tests and keep TypeScript errors clean. Follow the existing code style and lint rules in the repo.

License
-------
This project does not include a license file. Add one if you plan to publish or share.
