# Government Welfare Advisory System

Full-stack web application that helps citizens discover eligible government welfare schemes and enables officers/admins to manage applications and schemes.

## Repositories
- Backend: `backend/`
- Frontend: `frontend/`
- Database SQL: `database/`
- ML model: `ml-model/`

## Tech Stack
- Backend: Java, Spring Boot, Spring Data JPA
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Database: MySQL (or compatible SQL)
- ML: Python, scikit-learn

## Quick Start

### 1. Database
Run SQL files in this order:
- `database/users.sql`
- `database/scheme.sql`
- `database/scheme_details.sql`
- `database/applications.sql`
- `database/eligibility_history.sql`

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Roles
- **User**: Eligibility check, recommended schemes, apply, track applications
- **Officer**: Review and approve/reject applications
- **Admin**: Manage schemes, officers, users, and assignments

## API Summary
See `backend/README.md` for full endpoint list and request details.

## Folder Highlights
- `backend/src/main/java/com/project/welfare`: Spring Boot source
- `frontend/src/app/components`: React UI components
- `database`: SQL schema + seed data
- `ml-model`: ML prediction model and training scripts

## Notes
- Development auth uses headers `X-User-Role` and `X-User-Id`.
- CORS allows localhost by default.

