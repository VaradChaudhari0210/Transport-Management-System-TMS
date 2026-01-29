# Transportation Management System (TMS)

A full-stack Transportation Management System (TMS) demo app built with React (frontend), Node.js/GraphQL/Prisma (backend), and PostgreSQL. This project demonstrates scalable architecture, beautiful UI, and performance best practices.

## Features

### Frontend (React)
- Responsive, modern UI with Tailwind CSS
- Hamburger and horizontal navigation menus
- Grid and tile views for shipments
- Shipment detail modal with navigation
- Tile actions: edit, flag, delete
- Uses dummy data or can be configured to fetch from a public API

### Backend (Node.js, GraphQL, Prisma)
- GraphQL API for shipment management
- Prisma ORM with PostgreSQL
- Data models: User, Shipment, TrackingEvent
- Queries: list, filter, paginate, and sort shipments
- Mutations: add, update, delete shipments; add tracking events
- Authentication & role-based authorization (admin, employee)
- Performance: DataLoader for batching/caching, indexed queries

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database (local or cloud)

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and set your `DATABASE_URL`.
3. Run migrations and seed data:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The GraphQL API will be available at `http://localhost:4000/graphql`.

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure API endpoint in `src/lib/apollo-client.ts` if needed.
3. Start the frontend:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Deployment
- Deploy the backend to Render, Railway, or similar Node.js hosting.
- Deploy the frontend to Vercel, Netlify, or similar static hosting.
- Use a managed PostgreSQL service (e.g., Supabase, Neon, Railway).

## Project Structure
- `backend/` — Node.js, GraphQL, Prisma API
- `frontend/` — React, Vite, Tailwind CSS UI

## License
MIT

---

For demo credentials, API docs, or deployment help, see the respective README files in each folder or contact the maintainer.
