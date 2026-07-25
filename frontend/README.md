# Urban Cart — Ecommerce Frontend (React + Vite)

React frontend for a full-featured ecommerce site: product browsing with search/filter/pagination,
cart, checkout, order history, and an admin dashboard for managing products and orders.

## Tech Stack
- React 18 + Vite
- React Router v6
- Axios (with JWT auto-attached to requests)
- Context API for auth and cart state

## Local Setup
1. `npm install`
2. Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your backend
   (e.g. `http://localhost:8080/api` locally, or your Render URL in production)
3. `npm run dev` — opens at `http://localhost:5173`

## Creating an Admin User
The register endpoint always creates a `USER` role account. To test the admin dashboard:
1. Register a normal account
2. Manually update that user's `role` column to `ADMIN` in your PostgreSQL database:
   `UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';`
3. Log out and log back in so a new token with the ADMIN role is issued

## Deployment (Netlify)
1. Push this repo to GitHub
2. Netlify → Add new site → Import from Git → select repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL` = your deployed Render backend URL + `/api`
6. Deploy — Netlify will give you a live URL
7. Go back to your backend's `CORS_ALLOWED_ORIGINS` env var on Render and set it to this Netlify URL
