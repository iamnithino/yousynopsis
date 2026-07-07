# Synopsis AI

Synopsis AI uses a React/Vite frontend, FastAPI backend, and a dedicated Node.js transcript service.

## Services

- `frontend/`: React + Vite app deployed on Vercel.
- `backend/`: FastAPI API for auth, users, summaries, comparison, chat, PPT generation, history, Firebase, and Cerebras AI.
- `transcript-service/`: Express service that calls `youtube-caption-extractor` and returns transcripts to FastAPI.

## Local Docker

Create `backend/.env` with your existing backend secrets, then run:

```bash
docker compose up --build
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Transcript service: `http://localhost:3001`

The backend calls the transcript service through Docker DNS:

```env
TRANSCRIPT_SERVICE_URL=http://transcript-service:3001
```

## Render Deployment

Deploy the backend as a Render Web Service from `backend/`.

Required backend environment variables:

```env
PORT=10000
TRANSCRIPT_SERVICE_URL=https://YOUR-TRANSCRIPT-SERVICE.onrender.com
CEREBRAS_API_KEY=...
CEREBRAS_API_KEY_FAST=...
CEREBRAS_API_KEY_THIRD=...
CEREBRAS_API_KEY_COMPARISON=...
CEREBRAS_API_KEY_USE_CASE=...
CEREBRAS_API_KEY_PRESENTATION=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
CORS_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app
```

If you deploy the transcript service as a Render Private Service, use the blueprint in `render.yaml`, which injects `TRANSCRIPT_SERVICE_HOST` into the backend and uses `TRANSCRIPT_SERVICE_PORT=3001`.

Deploy the transcript service as a Render Node service from `transcript-service/`.

Required transcript service environment variables:

```env
PORT=3001
CAPTION_GROUP_SECONDS=45
```

Build command:

```bash
npm ci
```

Start command:

```bash
npm start
```

## Vercel Deployment

Deploy `frontend/` on Vercel.

Required Vercel environment variable:

```env
VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com
```

No frontend API routes changed. Existing summarize, compare, Ask AI, PPT, auth, admin, and recent-history calls continue to use the FastAPI backend.
