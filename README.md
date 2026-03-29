# Restaurant Explorer

A full-stack web application for browsing NYC restaurants, reviewing inspection data, and leaving user reviews.

## Tech Stack

- **Frontend:** React + Vite + React Router + Axios
- **Backend:** Django + Django REST Framework + Simple JWT
- **Database:** SQLite (default development setup)

## Project Structure

```text
cisc4900/
├── backend/                # Django API
│   ├── api/                # Models, serializers, views, routes
│   ├── backend/            # Django settings and project urls
│   └── manage.py
├── frontend/               # React app
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
└── README.md
```

## Features

- User registration and login with JWT-based authentication
- Protected home route after login
- Restaurant list with client-side search
- Restaurant detail view
- Add and delete reviews (authenticated users)

## API Endpoints

### Auth

- `POST /api/user/register/` — Create a new user
- `POST /api/token/` — Obtain access and refresh tokens
- `POST /api/token/refresh/` — Refresh access token

### Restaurants

- `GET /api/restaurants/` — List restaurants
- `GET /api/restaurants/<id>/` — Get restaurant details

### Reviews

- `POST /api/reviews/` — Create a review (auth required)
- `DELETE /api/reviews/delete/<id>/` — Delete your review (auth required)

## Local Development Setup

## 1) Clone and enter the repo

```bash
git clone <your-repo-url>
cd cisc4900
```

## 2) Backend setup (Django)

```bash
cd backend
python -m venv .env
source .env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000` by default.

## 3) Frontend setup (React)

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://127.0.0.1:5173` by default.

## Running Checks

### Frontend

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
```

### Backend

```bash
cd backend
python manage.py test
```

## Notes

- CORS is currently open for all origins in development settings.
- Default backend database is SQLite.

