# 🎓 TrackLearn — Full-Stack Video Tracking & Learning Platform

> A modern, serverless-ready full-stack learning platform featuring real-time video watch-time tracking, dual-layer auto-resume, protected authentication routes, theme toggling, and an ultra-premium responsive design system.

---

## 📋 Executive Summary

**TrackLearn** allows students to sign up, log in, browse recorded class sessions, and watch live video lectures. 

The core feature is **intelligent video progress tracking**: when a user watches or drags the video seekbar, the app tracks their exact timestamp. If they refresh the browser (F5) or log out and return days later, the app **automatically resumes video playback from the exact second they stopped**.

---

## 🛠️ Technology Stack Architecture

| Layer | Technology | Purpose & Usage |
|-------|------------|-----------------|
| **Frontend Framework** | **React 18 + Vite 5** | High-performance Single Page Application (SPA) |
| **Routing** | **React Router v6** | Client-side routing, protected guards, tab parameter syncing |
| **Database & Authentication** | **Supabase (PostgreSQL)** | Auth JWT sessions, user profiles, video progress & class sessions DB |
| **Styling & Design** | **Vanilla CSS Tokens + Icons.jsx** | Dark/Light theme switching, glassmorphism, responsive drawer, SVG vector icons |
| **Backend API (Local/Dev)** | **Node.js + Express** | REST API endpoints, JWT auth middleware, admin database operations |

---

## 📁 Complete Directory & File Breakdown

### 🎨 Frontend Structure (`frontend/`)

```
frontend/
├── public/
│   └── favicon.svg                    • Custom purple 🎓 logo favicon displayed in browser tabs
│
├── src/
│   ├── api/
│   │   └── axiosClient.js             • Axios HTTP client configured with automatic Bearer token interceptor
│   │
│   ├── components/
│   │   ├── Icons.jsx                  • Central vector SVG icon library (Logo, Home, Live, Sessions, Logout, Sun, Moon, etc.)
│   │   ├── Navbar.jsx                 • Top navigation bar with brand logo, dark/light theme toggle, username avatar, and logout
│   │   ├── Sidebar.jsx                • Collapsible navigation sidebar (Expanded mode & 72px Icon-Only Mini Bar mode)
│   │   ├── SessionCard.jsx            • Interactive card component for displaying individual recorded class info
│   │   └── VideoPlayer.jsx            • HTML5 video player with dual-layer watch time tracking & auto-resume logic
│   │
│   ├── context/
│   │   └── AuthContext.jsx            • Global auth state manager (tracks user login, active session, and logout cleanup)
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx              • Sign-in screen with Supabase auth validation
│   │   ├── SignupPage.jsx             • Registration page supporting both email confirmation & instant login flows
│   │   └── DashboardPage.jsx          • Main application shell managing URL tab parameters (?tab=live) & drawer overlays
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx         • Security guard checking auth state & blocking post-logout back-button navigation
│   │
│   ├── styles/
│   │   ├── auth.css                   • Glassmorphic styles for login & signup forms
│   │   ├── dashboard.css              • Navbar, sidebar drawer, theme toggle, and layout styles
│   │   ├── homeView.css               • Time-based welcome greeting and quick action card styles
│   │   ├── liveView.css               • Video player container & live status badge styles
│   │   ├── sessionsView.css           • Class session card grid & thumbnail hover zoom styles
│   │   └── index.css                  • Global CSS variables for Dark/Light theme tokens & typography resets
│   │
│   ├── views/
│   │   ├── HomeView.jsx               • Dashboard home screen displaying time-based greeting & real-time session stats
│   │   ├── LiveView.jsx               • Container screen for the live video playback session
│   │   └── SessionsView.jsx           • Gallery grid fetching recorded class sessions from Supabase
│   │
│   ├── App.jsx                        • Root application routing configuration (/login, /signup, /dashboard)
│   ├── main.jsx                       • Vite React DOM entrypoint
│   └── supabaseClient.js              • Initializes Supabase client with production fallback credentials
│
└── vite.config.js                     • Vite build tool configuration
```

---

### ⚙️ Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── config/
│   │   └── supabaseAdmin.js           • Service Role Supabase admin client for backend operations
│   ├── controllers/
│   │   ├── authController.js          • User profile retrieval handler
│   │   ├── progressController.js      • Video watch progress GET/POST upsert handler
│   │   └── sessionController.js       • Class sessions query handler
│   ├── middleware/
│   │   └── authMiddleware.js          • Validates Supabase JWT access token on incoming requests
│   ├── routes/
│   │   ├── authRoutes.js              • Route definitions for /api/auth
│   │   ├── progressRoutes.js          • Route definitions for /api/progress/:videoId
│   │   └── sessionRoutes.js           • Route definitions for /api/sessions
│   └── index.js                       • Express server entrypoint
│
└── schema.sql                         • Complete PostgreSQL database schema (tables, RLS policies, triggers)
```

---

## 🔄 Core Application Workflows

### 1. Authentication & Security Guard (`ProtectedRoute.jsx`)
- **Login/Signup**: Users authenticate via Supabase Auth (`supabase.auth.signInWithPassword()`).
- **Route Guard**: Any unauthenticated access attempt to `/dashboard` is automatically bounced to `/login`.
- **History Lock**: On logout, `navigate('/login', { replace: true })` overwrites browser history. A `popstate` event listener blocks users from pressing the browser Back button to re-enter the dashboard.

### 2. Tab State Persistence Across Refresh (`DashboardPage.jsx`)
- When navigating tabs (Home ➔ Live ➔ Sessions), the active tab synchronizes with the URL (`/dashboard?tab=live`) and `localStorage`.
- When a user presses **F5 (Refresh)** or reloads the browser, the application reads `?tab=live` and re-opens the exact same view seamlessly!

### 3. Dual-Layer Video Auto-Resume (`VideoPlayer.jsx`)
- **Layer 1 (Instant Local Storage)**: On every 3-second interval, drag, or seek event, the player saves `last_position` to browser `localStorage`. On page refresh, it resumes playback in **0ms**.
- **Layer 2 (Cloud Database Sync)**: Simultaneously upserts progress to the Supabase `video_progress` PostgreSQL table in the background.

### 4. Dark / Light Theme System (`index.css` & `Navbar.jsx`)
- Toggle button in top Navbar switches between **Dark Mode** (Deep space `#06060c`) and **Light Mode** (Apple slate `#f6f6fc`).
- Remembers user preference in `localStorage.getItem("theme")`.
- Active sidebar items render an Electric Violet Gradient Capsule with **100% crisp white text** for maximum legibility in both modes.

---

## 🚀 How to Run Locally

### 1. Clone & Install Dependencies
```bash
# Terminal 1 — Frontend
cd frontend
npm install
npm run dev
```

```bash
# Terminal 2 — Backend
cd backend
npm install
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend Express Server**: `http://localhost:5000`

---

## 🌐 Production Deployment (Vercel)

1. Push code to GitHub: `git push origin main`.
2. Connect repository on **Vercel**.
3. **`vercel.json`** includes the Single Page Application rewrite rule:
   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build --prefix frontend",
     "outputDirectory": "frontend/dist",
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
4. Production App URL: **`https://usertracking.vercel.app`**
