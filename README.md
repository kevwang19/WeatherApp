# Weather Project

Full-stack weather application.

## Structure

| Directory   | Stack   | Port | Description |
| ----------- | ------- | ---- | ----------- |
| `frontend/` | Next.js | 3000 | Web UI      |
| `backend/`  | NestJS  | 3001 | API server  |

## Prerequisites

- Node.js 20+
- npm

## Getting started

Install dependencies in each app (run from the project root):

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

Run both in separate terminals:

```bash
# Terminal 1 — API
cd backend
npm run start:dev

# Terminal 2 — UI
cd frontend
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## Scripts

### Frontend (`frontend/`)

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Start dev server        |
| `npm run build` | Production build        |
| `npm run start` | Start production server |
| `npm run lint`  | Run ESLint              |

### Backend (`backend/`)

| Command              | Description           |
| -------------------- | --------------------- |
| `npm run start:dev`  | Start with hot reload |
| `npm run build`      | Compile to `dist/`    |
| `npm run start:prod` | Run compiled app      |
| `npm run test`       | Unit tests            |
| `npm run test:e2e`   | End-to-end tests      |
| `npm run lint`       | Run ESLint            |

## Environment variables

Create `.env` files in each app as needed. Env files are gitignored by default.

| Variable | App     | Default | Description |
| -------- | ------- | ------- | ----------- |
| `PORT`   | backend | `3001`  | API port    |
