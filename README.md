# JobTrackr

A full-stack job application tracker with a Kanban board, JWT authentication, and a comprehensive **Playwright E2E + API test suite** with CI/CD integration.

## Tech Stack

**Frontend:** React.js · Vite · Tailwind CSS · React Router
**Backend:** Node.js · Express.js · Prisma ORM · PostgreSQL (Neon)
**Auth:** JWT · bcrypt
**Testing:** Playwright (E2E + API)
**CI/CD:** GitHub Actions

## Features

- Kanban board with 4 status columns (Applied, Interview, Offer, Rejected)
- JWT-based authentication with bcrypt password hashing
- Full CRUD for job applications (company, role, status, location, salary, URL, notes)
- Analytics dashboard
- User-scoped data isolation

## Test Suite — 35 Automated Tests

| Test File | Tests | Coverage |
|---|---|---|
| `auth.spec.js` | 9 | Login, register, session, logout, route protection |
| `jobs-ui.spec.js` | 8 | Kanban CRUD via UI, modal, form validation |
| `api.spec.js` | 18 | REST APIs, JWT security, validation, error handling |

### Testing Highlights

- End-to-end browser tests using Playwright + Chromium
- API-level tests using Playwright's `request` fixture (no browser overhead)
- JWT security testing — tampered tokens, missing tokens, malformed tokens, missing Bearer prefix
- Test isolation with timestamp-based unique data
- Reusable helpers (`login()`, `openAddModal()`, `submitModal()`)
- GitHub Actions CI — full suite runs on every push with a fresh PostgreSQL instance

## Running Locally

### Prerequisites
- Node.js 20+
- PostgreSQL (use [Neon](https://neon.tech) free tier)

### Setup

```bash
# Backend
cd backend
npm install
# Create .env with DATABASE_URL, JWT_SECRET, PORT=3001, FRONTEND_URL=http://localhost:5173
npx prisma db push
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:3001/api
npm run dev
```

Visit `http://localhost:5173` and register an account.

### Running Tests

```bash
npx playwright test                    # Run all tests
npx playwright test tests/auth.spec.js # Run specific file
npx playwright test --ui               # Visual debugger
npx playwright show-report             # View last HTML report
```

## Author

Built by Khushi Tiwary
