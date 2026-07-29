# TrackLearn — Setup & Run Guide

## Prerequisites
- Node.js v18+
- npm v9+
- A Supabase account and project

---

## Step 1 — Set up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → click **SQL Editor**
3. Paste the entire contents of `backend/schema.sql` and click **Run**

---

## Step 2 — Configure Environment Variables

### Backend (`backend/.env`)
Open `backend/.env` and replace the placeholders:
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Frontend (`frontend/.env`)
Open `frontend/.env` and replace the placeholders:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_URL=http://localhost:5000
```

> Find your keys at: **Supabase Dashboard → Settings → API**

---

## Step 3 — Install Dependencies

Open **two separate terminals** in the project root.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
```

---

## Step 4 — Run the App

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## Project Structure

```
Tracking User/
├── frontend/                  ← React + Vite app
│   ├── src/
│   │   ├── api/               ← Axios client with auto auth headers
│   │   ├── components/        ← Navbar, Sidebar, VideoPlayer, SessionCard
│   │   ├── context/           ← AuthContext (global user state)
│   │   ├── pages/             ← LoginPage, SignupPage, DashboardPage
│   │   ├── routes/            ← ProtectedRoute (back-button guard)
│   │   ├── styles/            ← CSS files
│   │   └── views/             ← LiveView, SessionsView
│   └── .env                   ← Fill in Supabase keys
│
└── backend/                   ← Node.js + Express API
    ├── src/
    │   ├── config/            ← Supabase admin client
    │   ├── controllers/       ← Auth, Progress, Session controllers
    │   ├── middleware/        ← JWT verification middleware
    │   └── routes/            ← API route definitions
    ├── schema.sql             ← Run this in Supabase SQL editor
    └── .env                   ← Fill in Supabase keys
```

---

## Key Features

| Feature | How it works |
|---------|-------------|
| **Login / Signup** | Supabase Auth (email + password) |
| **Protected Route** | `ProtectedRoute.jsx` redirects to `/login` if no session |
| **Back-button block** | `navigate('/login', { replace: true })` removes dashboard from history |
| **Video tracking** | `timeupdate` + `seeked` events track real watch time |
| **Progress save** | Auto-saved every 5 seconds to Supabase via Express API |
| **Resume video** | On login, video seeks to `last_position` from database |
| **Sessions** | Fetched from Supabase `sessions` table via Express |
| **Sidebar** | CSS transition toggle, Live + Sessions + Logout |
