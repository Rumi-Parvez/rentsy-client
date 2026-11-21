# rEntsy — Equipment Rental Platform

rEntsy is a full-stack equipment rental marketplace where equipment owners list
their gear and customers search, book and pay for rentals online. The platform
has three roles — **Customer**, **Owner** and **Admin** — each with a dedicated
dashboard, secure JWT authentication and a complete Stripe checkout flow.

- **Live site:** `https://<your-live-url>` <!-- replace after deployment -->
- **Client repository:** `rentsy-client`
- **Server repository:** `rEntsy-server`

## Purpose

Equipment often sits idle while other people pay to rent the same type of gear.
rEntsy connects both sides in one trusted marketplace:

- Customers browse approved equipment, check availability, save favorites and
  book by date and quantity.
- Owners list equipment, manage approval status and track rental requests and
  earnings.
- Admins review listings, manage users and monitor every booking and payment.

## Key Features

### Public experience
- Home page with animated banner, six featured approved listings, categories,
  benefits, customer reviews and extra sections.
- All Equipment page with server-side search, category/rental-type/price/
  availability filters and sorting.
- Equipment details are a private route; signed-out visitors are sent to login
  and returned to the listing afterwards.
- About, Contact, FAQ, Careers, Support, Pricing, How It Works, Rental Process,
  Categories, Privacy Policy, Terms of Service and Cookie Policy pages.
- Branded loading skeletons, 404 page and error boundaries.

### Authentication & authorization
- Better Auth email/password registration and login.
- Google and GitHub social login.
- Password rule: at least 6 characters with an uppercase and a lowercase letter.
- JWT access tokens verified by Express with the Better Auth JWKS endpoint.
- Roles are read from MongoDB on every protected request; the browser cannot
  choose its own admin role.
- `verifyToken`, `verifyRole` middleware protect every private API route.

### Rental & payment flow
- Booking modal with start/end dates, quantity, contact, address and notes.
- Dynamic price calculation based on equipment rate, rental type (hourly,
  daily, weekly, monthly), billable units and quantity.
- Dedicated checkout page with an itemized price summary and delivery details.
- Stripe Checkout for one-time payments (test or live keys).
- Payment verification endpoint records the booking and transaction in MongoDB
  after a successful payment.
- Success page shows the confirmed booking; cancel page confirms that no charge
  was made.
- Booking status, payment status, transaction id and checkout id are stored for
  the customer, owner and admin dashboards.

### Dashboards
- **Customer:** rentals, favorites, profile, analytics.
- **Owner:** add equipment, my equipment, rental requests, profile, earnings.
- **Admin:** all users, all equipment approvals, all rentals, payments,
  analytics and role management.
- Charts, stat cards and a responsive dashboard layout.

## Tech Stack

**Client**
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Better Auth + JWT plugin + MongoDB adapter
- Framer Motion
- Lucide React + React Icons
- Recharts
- React Hot Toast

**Server**
- Node.js + Express 5 (ES modules)
- MongoDB driver
- `jose` for JWKS/JWT verification
- Stripe Node SDK
- CORS + dotenv

## Environment Variables

### `rentsy-client/.env`

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
MONGO_DB_CLIENT=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

ADMIN_EMAILS=
```

### `rEntsy-server/.env`

```env
PORT=5000
MONGODB_CLIENT_URI=your_mongodb_connection_string
DB_NAME=rEntsy_server_DB
BETTER_AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
CLIENT_URL=http://localhost:3000
ADMIN_EMAILS=

# Stripe (one-time Checkout payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
```

Never commit `.env` files. Both repositories ignore them.

### OAuth callback URLs

Add these in the Google Cloud Console and GitHub OAuth app settings:

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

Use the deployed client domain instead of `localhost` in production.

## Run Locally

```bash
# 1. Start the API
cd rEntsy-server
npm install
npm run dev        # http://localhost:5000

# 2. Start the client
cd rentsy-client
npm install
npm run dev        # http://localhost:3000
```

## Stripe Notes

- With `STRIPE_SECRET_KEY` present, the API creates a real Stripe Checkout
  session for the dynamically calculated total.
- Without the key, the API falls back to a simulated checkout so the booking
  and payment flow can still be reviewed.
- For reliable production confirmation, add a webhook endpoint:
  `https://<server-domain>/api/payments/webhook` and set
  `STRIPE_WEBHOOK_SECRET`.

## Admin Access

Create an account, then add its email to `ADMIN_EMAILS` (client and server) or
change the role from an existing admin account. The rubric submission form must
include the admin email and password used for review.

## npm Packages Used

**Client:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`,
`better-auth`, `@better-auth/mongo-adapter`, `mongodb`, `framer-motion`,
`lucide-react`, `react-icons`, `react-hot-toast`, `recharts`, `date-fns`,
`embla-carousel-react`.

**Server:** `express`, `mongodb`, `jose`, `stripe`, `cors`, `dotenv`, `nodemon`
(development).
