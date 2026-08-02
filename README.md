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
- Health check: [http://localhost:3001/health](http://localhost:3001/health)

No `.env` setup is required for local development — see [Intentional configuration choices](#intentional-configuration-choices) below.

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

## Testing

Tests live in the backend only. No server needs to be running — tests boot their own in-memory app and mock external API calls.

From `backend/`:

```bash
npm test          # unit tests (src/**/*.spec.ts)
npm run test:e2e  # e2e tests (test/**/*.e2e-spec.ts)
```

## API endpoints

| Method | Path               | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/health`          | Service health check     |
| GET    | `/geocode?q=`      | Search locations         |
| GET    | `/weather/current` | Current weather (`lat`, `lon`) |
| GET    | `/weather/forecast`| 5-day forecast (`lat`, `lon`) |

## Environment variables

Optional. Only `PORT` is read from the environment today.

| Variable | App     | Default | Description |
| -------- | ------- | ------- | ----------- |
| `PORT`   | backend | `3001`  | API port    |

## Intentional configuration choices

This project is set up for easy local evaluation — clone, install, run. A few values are **hardcoded on purpose** rather than hidden behind env files:

| Setting | Location | Value | Why |
| ------- | -------- | ----- | --- |
| OpenWeather API key | `backend/src/weather/weather.service.ts` | Included in source | Reviewers can run the backend with zero config. In production, this would move to a server-side env var (e.g. `OPENWEATHER_API_KEY`) and never ship in git. |
| Backend URL | `frontend/lib/api.ts` | `http://localhost:3001` | Matches the default local API port. In production, this would become something like `NEXT_PUBLIC_API_URL` per deploy environment. |


## Future considerations

High-level directions if this were extended beyond the assignment scope, not implemented here.

### Authentication & authorization

- User sign-up / login (OAuth, sessions)
- Protect write endpoints and per-user data; rate-limit anonymous vs authenticated usage
- Role-based access if admin or internal tooling is added later

### Caching

- Short-TTL cache on the backend for repeated OpenWeather calls (same location, same endpoint)
- Frontend skip refetching tab data already loaded for the current location in recent past
- Optional shared cache (e.g. Redis) if running multiple API instances

### Account features (requires a database)

- Saved locations and default home city
- Search history and recently viewed forecasts
- User preferences (units, theme, notification settings)
- Persisted alert rules (e.g. notify when rain > 50%)

### Domain & business logic (Palmetto / solar context)

- **Site suitability:** score locations for solar using sunshine hours, cloud cover, and seasonal patterns (historical or enriched data beyond current/forecast)
- **Operations & maintenance:** flag conditions that affect panel performance or field work ... heavy rain, high wind, extreme heat, snow/ice
- **Recommendations:** suggest optimal install windows, cleaning schedules, or dispatch timing based on forecast + historical trends
- **Reporting:** aggregate weather exposure over time for a customer site or portfolio

### Error logging and Observability
- more precisely categorized error logging for frontend / backend as business logic grows
- observability tools depending on hosting / infrastructure setup ... Vercel vs AWS vs Sentry / Datadog, etc
