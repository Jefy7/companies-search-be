# Full Stack Setup Guide

## This project contains:

🖥️ Next.js (Frontend)
⚙️ NestJS (Backend API)
🐍 FastAPI (AI / Python service)
🗄️ Database (PostgreSQL / Prisma / SQL scripts)
## 🚀 1. Prerequisites

Make sure you have installed:

Node.js >= 18
npm / yarn / pnpm
Python >= 3.10
PostgreSQL (or Docker if using container DB)
Git
### 📁 Project Structure
root/
│
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # NestJS backend
│   └── ai-service/       # FastAPI service
│
├── libs/db
│   ├── entities/
│   └── seeds/company.seeds.ts
│
└── README.md
-----------------------------

## ⚙️ 2. Setup Database
 
`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

`CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    sub_sector VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    linkedin VARCHAR(255),
    tags JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);`
----------------
Create .env:

PORT=8080

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Itsjefy7
DB_NAME=company_search

UPSTASH_REDIS_REST_URL="https://immortal-buffalo-85006.upstash.io"
UPSTASH_REDIS_REST_TOKEN="gQAAAAAAAUwOAAIncDFkODMyNTNiZDFmZDY0OTgzODE3Mjg2NzIwZTc2MGY0M3AxODUwMDY"
-------------------
Run migrations
`npx ts-node libs/db/src/seeds/run-seed.ts  ` 
-------------------------------


## ⚙️ 3. Run NestJS Backend
Install dependencies
`npm install`

`npm run build`
Backend runs at:

http://localhost:8080


