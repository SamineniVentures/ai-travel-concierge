# ai-travel-concierge


## Frontend

The `frontend` directory contains a React application built with [Vite](https://vitejs.dev/).

### Development server

```
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.
The development server uses `VITE_API_URL` from `.env.development` to proxy API
requests to the backend. You can adjust this URL if your backend runs on a
different port.

### Production build

```
cd frontend
npm run build
```

This will generate the static files in `frontend/dist`.

### Deploying to Vercel

To deploy the frontend on [Vercel](https://vercel.com), create a project with
the **frontend** folder as the root directory. Set an environment variable named
`VITE_API_URL` pointing to your backend API base URL (for example,
`https://my-backend.example.com`). Vercel will run `npm run build` and serve the
generated files from `frontend/dist`.

## Backend

The backend is a small [FastAPI](https://fastapi.tiangolo.com/) service located
in the `backend` directory. It exposes an endpoint used by the React
application to search for flights. Results are fetched from the Skyscanner
Flights API.

### Development server

Create an environment variable with your Skyscanner API key before starting the
server:

```bash
export SKYSCANNER_API_KEY=<your_key>
uvicorn backend.main:app --reload
```

The API will then be available at `http://localhost:8000` and the React app can
access it via `/api/flights`.
