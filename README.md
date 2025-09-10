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
