# Velozity Backend - Multi-Tenant SaaS API

## Overview
This project is a **multi-tenant REST API** for a B2B SaaS platform. It implements:

- Multi-tenant isolation (each tenant has its own users and data)
- Tenant-based API key authentication
- Sliding window rate limiting (three tiers: global, endpoint, burst)
- Queue-based transactional email engine using Bull + Redis
- Tamper-evident audit trail with chain hashing
- Health & metrics endpoints
- PostgreSQL database with Prisma ORM

This backend is built with **Node.js, TypeScript, and Express**.

---

## Project Structure
src/
├── server.ts # Entry point
├── middleware/
│ ├── tenantAuth.ts # Tenant API key authentication
│ └── rateLimiter.ts # Sliding window rate limiter
├── routes/
│ ├── userRoutes.ts
│ └── authRoutes.ts
├── utils/
│ └── redis.ts
└── seed.ts # Seed script
prisma/
└── schema.prisma # Database schema

Install dependencies:
npm install
Create .env file in the root directory:
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
REDIS_URL=redis://localhost:6379
INTERNAL_API_KEY=your_internal_key
PORT=3000
Run database migrations:
npx prisma migrate deploy
Seed initial data:
npx ts-node src/seed.ts
Start the server:
npm run start

Server will run at: http://localhost:3000

II. Deployment

This project is deployed on Render:

https://velozity-backend-cotd.onrender.com

Branch: main
Build command: npm install
Start command: npm run start
Environment variables set on Render dashboard:
DATABASE_URL
REDIS_URL
INTERNAL_API_KEY

III. Guide to Output

User Endpoints

GET /users – List all users (Owner + Members)
POST /users – Create new user (Owner only)

Auth Endpoints

POST /auth/login – Login user to get JWT token

Audit Endpoints

GET /audit/verify – Verify the audit log chain integrity

Health & Metrics

GET /health – Returns system health (API, DB, Redis, queue depth, response time)
GET /metrics – Returns per-tenant usage stats

Headers

x-api-key: Tenant API key (mandatory)
Authorization: Bearer <token> for endpoints requiring user authentication

IV. Features / Architecture
Tenant Isolation: Enforced at query level using tenantId filtering; no tenant can access another tenant’s data.
Sliding Window Rate Limiter: Three-tier (global, endpoint, burst) using Redis; returns detailed 429 response when limits exceeded.
Queue-Based Email Engine: Uses Bull + Redis; retry logic with exponential backoff; dead-letter queue; email templates separate from sending logic.
Tamper-Evident Audit Trail: Each write operation hashed with SHA-256 chain; append-only table; verification endpoint to detect tampering.
Health & Observability: Tracks DB, Redis, queue, and API usage; internal API key protected endpoints.
Security: API keys hashed with bcrypt; parameterized queries only; secrets stored in environment variables.

V. Seed Script
The seed script (src/seed.ts) performs the following:

Creates 2 tenants with 3 users each (1 Owner + 2 Members)
Generates a pre-existing audit log with ≥10 entries
Populates Redis with sample rate limit counters for testing

Run the seed script:

npx ts-node src/seed.ts


VI. Testing
Integration tests focus on:
Sliding window rate limiting logic
Audit chain verification
Run tests with:
npm run test
Ensure Redis and PostgreSQL are running before tests.


VII. Known Limitations
Emails are sent via a test SMTP service (Ethereal/Mailtrap); not delivered to real inboxes.
Free Render instances may spin down after inactivity causing slow initial requests.
Audit log verification may be slow for large datasets.


VIII. Contributing to this Project

We welcome contributions!

Bug Reports:

Use GitHub issues
Provide environment details, Node.js version, OS, and reproduction steps

Pull Requests:

Fork the repo and clone your fork
Create a feature branch
Commit changes in logical chunks
Push branch and open a Pull Request with title & description
Agree that your contribution will follow the same license
