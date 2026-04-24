# Hierarchy Processor Monorepo

Full-stack project with:

- `backend`: Node.js + Express REST API (`POST /bfhl`)
- `frontend`: React + Vite UI for submitting and visualizing hierarchy data

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run start
```

Backend runs on `http://localhost:3000` by default.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend uses `VITE_API_URL` from `frontend/.env`.

## Deployment

### Backend on Railway

This backend is configured for Railway deployment:

- `backend/package.json` has production `start` script (`node src/index.js`)
- `backend/railway.json` includes deploy start command
- Server binds to `process.env.PORT || 3000`

Railway setup:

1. Create a new Railway project and connect this GitHub repo.
2. Set service **Root Directory** to `backend`.
3. Add environment variable:
   - `PORT=3000` (optional on Railway, Railway injects PORT automatically)
4. Deploy.

After deploy, your backend will be available at:

- `https://<your-railway-domain>/bfhl`

### Frontend deployment-ready

Frontend is configured for static hosting:

- `frontend/vercel.json` for Vercel
- `frontend/netlify.toml` for Netlify
- `frontend/.env.example` documents required env var

Set this env var on your frontend hosting platform:

- `VITE_API_URL=https://<your-backend-railway-domain>`

Then deploy with project root set to `frontend` (or configure build dir accordingly).

## API

### `POST /bfhl`

Request:

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

Response includes:

- hardcoded identity fields
- `hierarchies` with cycle and tree handling
- `invalid_entries`, `duplicate_edges`
- `summary` with totals and largest tree root

## Notes

- Inputs are processed in-memory per request.
- Multi-parent conflicts are resolved by first-seen parent wins.
- Duplicate edges are reported only once.
