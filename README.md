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
