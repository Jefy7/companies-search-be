# NestJS AI-Assisted Prospect Search Backend

Production-ready NestJS backend featuring unified filter and AI-assisted company search, PostgreSQL persistence, Redis caching, CSV export, and comprehensive Jest coverage.

## Setup

```bash
npm install
npm run test
npm run lint
npm run build
```

## Environment variables

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `AI_API_URL` (FastAPI parser endpoint base URL)
- `PORT`

## APIs

- `GET /companies`
- `GET /companies/export`
- `POST /search/ai`
