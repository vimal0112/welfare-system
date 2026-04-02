# Government Welfare Advisory System - Backend

Spring Boot backend for the Government Welfare Advisory System.

## Tech Stack
- Java + Spring Boot
- Spring Data JPA
- MySQL (or any SQL DB with compatible schema)

## Project Structure
- `src/main/java/com/project/welfare/controller` REST controllers
- `src/main/java/com/project/welfare/service` business logic
- `src/main/java/com/project/welfare/repository` JPA repositories
- `src/main/java/com/project/welfare/Entity` JPA entities
- `src/main/resources/application.properties` application config

## Prerequisites
- Java 17+ (or the version configured in your project)
- Maven 3.8+
- MySQL (or compatible database)

## Database Setup
SQL schemas are in the `database` folder at repo root:
- `database/users.sql`
- `database/scheme.sql`
- `database/scheme_details.sql`
- `database/applications.sql`
- `database/eligibility_history.sql`

Create a database and run the SQL files in that order. If you already have data, apply the `ALTER TABLE` statements instead of re-creating tables.

## Run Backend
From repo root:

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

## Authentication Model (Current)
This project uses a simple header-based role check for admin/officer/citizen routes.
The frontend sends:

```text
X-User-Role: USER | OFFICER | ADMIN
X-User-Id: <numeric id>
```

## Key API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Eligibility
- `POST /api/welfare/check-eligibility`
- `GET /api/welfare/history?userId={id}`

### Applications (Citizen)
- `POST /api/applications`
- `GET /api/applications/user/{userId}`

### Officer
- `GET /api/officer/dashboard`
- `GET /api/officer/applications/pending`
- `GET /api/officer/applications?status=PENDING|APPROVED|REJECTED`
- `GET /api/officer/application/{id}`
- `PUT /api/officer/application/{id}/approve`
- `PUT /api/officer/application/{id}/reject`

### Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/schemes`
- `POST /api/admin/schemes`
- `PUT /api/admin/schemes/{id}`
- `PUT /api/admin/schemes/{id}/details`
- `DELETE /api/admin/schemes/{id}`
- `GET /api/admin/users`
- `POST /api/admin/officer`
- `PUT /api/admin/user/{id}/role`
- `PUT /api/admin/user/{id}/status`
- `PUT /api/admin/application/{id}/assign`
- `GET /api/admin/applications`

## CORS
CORS is enabled for localhost. If you change frontend port, update `backend/src/main/java/com/project/welfare/config/WebConfig.java`.

## Notes
- This is a development setup (no JWT yet).
- If you see 403 errors, confirm role headers are being sent.
- Officer visibility rules:
  - Officers can see assigned applications + unassigned pending
  - Officers cannot see applications assigned to other officers

