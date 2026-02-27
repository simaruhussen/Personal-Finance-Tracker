# Personal Finance Tracker — Frontend

This is the frontend (React + Vite) for the Personal Finance Tracker. It provides UI for adding and viewing transactions, charts, and basic flows (auth, create/edit/delete transactions).

## Features
- Vite + React
- React Router for navigation
- Form handling with `react-hook-form`
- Server interaction via Axios / TanStack Query
- Charts with `recharts`
- Tailwind / shadcn UI utilities available in the project

## Prerequisites
- Node.js (>= 18)
- The backend API running (see `backend/README.md`)

## Quickstart (development)
1. Install dependencies at project root:
   ```bash
   npm install
   ```
2. Configure backend API base URL for development (Vite expects env vars starting with `VITE_`):
   - Create a `.env` in the project root (not committed) with:
     ```
     VITE_API_URL=http://localhost:4000
     ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open the app (Vite will print the local URL, usually `http://localhost:5173`).

## Build
- `npm run build` — build frontend for production  
- `npm run preview` — preview production build locally

## Useful scripts
- `dev` — start Vite dev server  
- `build` — compile TypeScript and bundle with Vite  
- `lint` — run ESLint


## Environment variables
- `VITE_API_URL` — base URL of the backend API (e.g., `http://localhost:4000`)

## Testing
- The project includes testing tooling (Vitest, React Testing Library). Run tests with your configured test runner (see `package.json`).

