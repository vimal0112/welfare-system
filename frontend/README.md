# Government Welfare Advisory System - Frontend

React frontend for the Government Welfare Advisory System.

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Prerequisites
- Node.js 18+
- npm 9+ (or pnpm/yarn)

## Install

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment / API
The frontend calls the backend at:

```text
http://localhost:8080
```

If you change backend host/port, update the API base URLs in components such as:
- `frontend/src/app/components/Login.tsx`
- `frontend/src/app/components/OfficerDashboard.tsx`
- `frontend/src/app/components/AdminDashboard.tsx`
- `frontend/src/app/components/TrackApplications.tsx`

## Roles & Navigation
- **User**: Home, Dashboard, Eligibility Check, Schemes, Track Applications, History
- **Officer**: Dashboard, Applications, Schemes
- **Admin**: Dashboard (analytics only), Schemes, Officers, Applications, Users

## Notes
- The app uses localStorage `user` data after login.
- If you see 403 errors, confirm the role and user headers are sent.

