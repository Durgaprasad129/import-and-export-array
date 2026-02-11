# Franchise-Ready Food Delivery Platform (Monolith + 5 Role Apps)

This repository contains:

- `backend/`: one shared Node.js + Express + MongoDB backend.
- `apps/customer-app`
- `apps/restaurant-app`
- `apps/delivery-partner-app`
- `apps/franchise-admin-app`
- `apps/super-admin-app`

Each frontend app is an isolated React + Vite + Tailwind app with independent login and role-gated routing, while all apps consume the same backend REST APIs.

## Architecture Principles

- One city maps to one franchise.
- Every restaurant, delivery partner, and order belongs to exactly one franchise.
- Cross-franchise access is blocked (except `super_admin`).
- REST-only APIs with JWT auth, role middleware, and franchise-scope middleware.
- Manual fallback and stability-first behavior.

## Backend Quick Start

```bash
cd backend
cp ../.env.example .env
npm install
npm run seed
npm run dev
```

Backend default: `http://localhost:4000`

## Frontend Quick Start (for any one app)

```bash
cd apps/customer-app
cp ../../.env.example .env
npm install
npm run dev
```

Repeat for each app folder as needed.

## API Surface by Role

- `/api/auth/*`: signup/login.
- `/api/customer/*`: restaurant browsing, order placement, order history, reorder, post-delivery reviews.
- `/api/restaurant/*`: profile, open/close, menu updates, incoming orders, accept/reject.
- `/api/delivery/*`: online toggle, assigned orders only, pickup/deliver updates, today earnings.
- `/api/franchise-admin/*`: approvals, city orders, manual assignment, city config, coupons.
- `/api/super-admin/*`: franchise management, franchise admin assignment, global overrides, health snapshot.

## Notes

- Payment methods are constrained to COD and Razorpay mode markers.
- One coupon per order, no stacking.
- Status-based delivery tracking stores only last known location.
- No microservices, no GraphQL, no wallets, no subscriptions, no websockets.
