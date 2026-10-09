# Venerdi — Fashion Store (Frontend)

Storefront and admin dashboard built with Next.js (App Router), React, TypeScript, Tailwind CSS and Zustand.

## Features
- Product browsing, filters, categories, featured products
- Cart drawer (guest + logged-in), coupons, shipping by governorate
- Checkout with Cash on Delivery or Stripe card payment
- Orders history and guest order tracking
- Live support chat (Socket.IO)
- Admin panel: analytics, products, categories, orders, coupons, shipping, users, support chat
- Role based access (admin / manager / support)
- Wake-up screen for the free-tier backend (Render) with a live progress estimate

## Getting started
```bash
cp .env.example .env.local
npm install
npm run dev     # http://localhost:3000
```
You also need the API and chat server running (see their repositories).

## How API calls work
The browser only talks to its own origin. `next.config.ts` rewrites `/api/v1/*` to the backend
(`API_ORIGIN`), which keeps auth cookies first-party and works on Safari / iOS.

## Deployment
Deployed on Vercel. Set `API_ORIGIN`, `NEXT_PUBLIC_CHAT_SERVER_URL` and
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the project settings, then redeploy.