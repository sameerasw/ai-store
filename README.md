# AI Store (Monorepo)

Full-stack AI-based e-commerce demo with:
- Backend: Node.js + Express + SQLite
- Frontend: React + Vite
- Single launcher: `node start.js` starts both servers (frontend + backend)

## Quick Start

1. Install dependencies for both projects
```
npm --prefix backend install
npm --prefix frontend install
```

2. Start both servers with a single command
```
npm start
```

- Backend runs at http://localhost:4000
- Frontend runs at http://localhost:5173

Default users (seeded):
- admin / admin123 (role: admin)
- user / user123 (role: user)

## Project Structure
```
/ai-store
  /backend
  /frontend
  package.json
  start.js
  README.md
```

## Notes
- JWT stored in localStorage in the browser.
- SQLite database file stored at `backend/data/ai-store.sqlite`. Created/seeded automatically on first run.
- Customize JWT secret via `BACKEND_JWT_SECRET` env var.
- Cart persists to localStorage (restored on reload).

## Scope Alignment (MVP)
- Implemented now: Login/Logout (seeded users), read-only Product Catalog with search + filters (`q`, `category`, `tags`), read-only Offers, client-side Cart totals (subtotal, coupons: SAVE10/SAVE20/FREESHIP, 8% tax, shipping rules with free at ≥$100 or FREESHIP), Orders (create/list/get for current user).
- Deferred for future: Admin portal & CRUD, checkout forms & payment processing, emails/notifications, automated order status lifecycle, user registration & saved addresses.
- Chatbot discovery and admin UI are not included in this cut.

## Smoke tests
- API smoke (read-only by default):
  - `npm run smoke:api`
  - Env: `BACKEND_URL` (default http://localhost:4000), `USERNAME`/`PASSWORD` (defaults user/user123)
  - To create an order as part of smoke: set `ALLOW_MUTATION=true`

- UI smoke (reachability):
  - `npm run smoke:ui`
  - Env: `FRONTEND_URL` (default http://localhost:5173)
