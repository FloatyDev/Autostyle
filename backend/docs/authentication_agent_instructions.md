# Authentication & Admin Panel Agent Instructions

Welcome, Agent! Your mission is to build the Authentication layer and an Admin Panel for the Autostyle e-commerce website. You are picking up after the successful development of the public PHP API and frontend integration.

## 🛠 Tech Stack Overview
- **Backend**: Containerized PHP 8.2 + Apache (`docker exec autostyle-backend`)
- **Database**: Containerized MySQL 8.0 (`PDO`, host: `db`, db: `autostyle`, root/rootpassword)
- **Routing**: `bramus/router`
- **Frontend**: React (TypeScript), Vite, Tailwind CSS v4. Located at project root.
- **Integration**: Vite handles `Proxy` for `/api` straight to the PHP Apache container.

## 📍 Current State
The public-facing components are finished:
- The database schema is live and successfully seeded (`backend/scripts/migrate_and_seed.php`).
- Public endpoints for `/api/products`, `/api/categories`, and `/api/vehicles/*` are deployed, tested (24 PHPUnit tests passing), and fully robust.
- The React `/shop` and vehicle selector query `fetch()` against these APIs successfully.

## 🎯 Your Goals for this Phase

### 1. Database Updates
- **Users/Admins Table**: You need to design and migrate a table `admins` (or `users` with an admin role flag).
- Update the PHP seeder script or create a standalone script to generate an initial admin credential (e.g., `admin@autostyle.com` / `password123` hashed via `password_hash()`).

### 2. PHP Authentication API
- **Login Endpoint**: Create `AuthController.php` responding to `POST /api/auth/login`. Verify credentials and issue an authentication token.
- **Tokens/Sessions**: Implement JWT (JSON Web Tokens) or standard PHP Sessions. **JWT is highly recommended** since the frontend is decoupled React and we are using proxy routing.
- **Middleware/Security**: You will need to build an Authentication Middleware for `bramus/router`. Ensure that any new endpoints under `/api/admin/*` reject unauthorized requests with `401 Unauthorized`.

### 3. CMS / Admin Backend Endpoints
Create secured REST controllers for the admin panel to mutate data:
- `AdminProductController` (Create, Update, Delete parts, handle image uploads).
- `AdminCategoryController`.

### 4. React Frontend Admin Panel
- **Routing**: Utilize `react-router-dom` to create an `/admin` ecosystem.
- **Login Screen**: A sleek, secure login interface for administrators.
- **Dashboard UI**: Design a modern, premium Admin Dashboard using Tailwind CSS v4.
- **Action Pages**: Build UI interfaces allowing the user to Add/Edit/Delete products, manage categories, and configure website parameters. Use React contexts or state to manage the auth token securely.

## 🛑 Important Rules
- Do NOT break existing public APIs.
- Write tests: The previous dev left great PHPUnit structure in `backend/tests/`. Make sure you test the protected `Admin` endpoints and ensure they reject unauthenticated requests.
- Aesthetic: The admin panel should live up to the premium visual aesthetic set by the rest of the Autostyle React app.
- When you are done with a feature, document it in a `walkthrough.md`.

Good luck!
