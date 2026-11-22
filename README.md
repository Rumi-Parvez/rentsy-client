# rEntsy — Equipment Rental & Booking Marketplace

**rEntsy** is a full-stack equipment rental and booking marketplace designed to connect customers with equipment owners. The platform makes it easier to discover rental equipment, view availability and details, book equipment, manage bookings, save favorites, and manage rental listings from a role-based dashboard.

From construction machinery and heavy equipment to other rental gear, rEntsy provides a centralized platform where customers can find equipment for their needs while owners can list and manage their rental inventory.

The idea behind this project is simple: **make equipment rental easier, more organized, and accessible through a modern full-stack web application.**

---

## 🌐 Live Application & Repositories

| Resource | Link |
|---|---|
| 🌍 Live Website | [rEntsy](https://rentsy-xi.vercel.app/) |
| 💻 Client Repository | [GitHub — Client](https://github.com/Rumi-Parvez/rentsy-client) |
| ⚙️ Server Repository | [GitHub — Server](https://github.com/Rumi-Parvez/rEntsy-server) |
| 🔗 Live Backend API | [rEntsy Server API](https://rentsy-server.vercel.app/) |

---

## ✨ Key Features

rEntsy provides a complete equipment rental and booking experience with customer, owner, and admin functionality.

### Equipment Discovery

- Browse available rental equipment.
- Explore equipment by category.
- View equipment details through public detail pages.
- Display equipment images, pricing, duration, descriptions, and rental information.
- Responsive equipment cards and listing layouts.

### Equipment Management

- Equipment owners can create rental listings.
- Owners can update their own equipment.
- Owners can delete their own equipment.
- Backend ownership validation prevents users from modifying equipment they do not own.
- Equipment status and category management are protected by role-based authorization.

### Equipment Booking

- Customers can book available equipment.
- Booking information is stored in MongoDB.
- Users can view their booking history.
- Booking operations are protected by authentication.
- Booking data is connected with the authenticated user.

### Favorites

- Authenticated users can save equipment to favorites.
- Users can view their saved equipment.
- Favorite operations are protected through authentication.

### Personalized Dashboard

The dashboard provides role-based functionality for authenticated users.

Customers can manage:
- Bookings
- Favorites
- Profile information

Owners can manage:
- Equipment listings
- Rental activity
- Booking-related information

Admins can manage protected administrative operations and platform-level data.

### Secure Authentication

- Email/password authentication using Better Auth.
- Google authentication.
- GitHub authentication.
- Session management through Better Auth.
- JWT support for protected backend API operations.
- MongoDB adapter for Better Auth.

### Role-Based Authorization

The application supports multiple user roles:

- `customer`
- `owner`
- `admin`

Protected backend routes verify both authentication and authorization before allowing sensitive operations.

### Profile Management

Authenticated users can manage profile information such as:

- Name
- Profile image
- Phone number
- Address

### Payment Integration

rEntsy includes payment integration for rental-related payment flows.

Payment functionality includes:

- Checkout/payment flow.
- Payment status handling.
- Stripe integration.
- Backend payment APIs.
- Payment verification and related transaction handling.
- Stripe webhook handling for payment events.

### Analytics

The platform includes protected analytics functionality for dashboard and platform-related information.

### Contact System

Users can submit contact information/messages through the platform's contact functionality.

### Responsive Design

The application is designed for:

- Mobile
- Tablet
- Desktop

The UI adapts across screen sizes while maintaining the existing application structure and functionality.

### Interactive User Experience

The application includes:

- Loading states
- Form validation
- Toast notifications
- Confirmation dialogs
- Responsive navigation
- Dark/light theme support
- Reusable UI components
- Smooth interactive UI elements

---

## 🛠️ Technology Stack

### Frontend

- Next.js 16.4.6
- React 19.3.0
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- DaisyUI
- Lucide React
- React Icons
- React Hot Toast
- Next Themes
- Framer Motion
- Recharts
- Embla Carousel
- React Day Picker

### Authentication & Security

- Better Auth
- Better Auth MongoDB Adapter
- JWT
- JOSE
- Google OAuth
- GitHub OAuth
- JWKS-based JWT verification
- Role-based authorization

### Backend & Database

- Node.js
- Express.js
- MongoDB
- MongoDB Native Driver
- REST API
- CORS
- dotenv

### Payments

- Stripe
- Stripe Webhooks
- Checkout/payment APIs

### Tools & Deployment

- Git
- GitHub
- Vercel
- MongoDB Atlas
- npm

---

## 🏗️ Application Architecture

rEntsy follows a separate frontend and backend architecture.

```text
                         rEntsy
                           |
             +-------------+-------------+
             |                           |
         Frontend                     Backend
         Next.js                    Node.js
         React.js                   Express.js
             |                           |
             |------ REST API -----------|
             |                           |
         Better Auth                  MongoDB
             |                           |
          JWT Client              JWT Verification
             |                           |
             +---- Protected API --------+
```

The frontend handles:

- User interface
- Navigation
- Better Auth authentication
- Session management
- API communication
- Dashboard experiences
- Booking and equipment interactions

The backend handles:

- REST API operations
- MongoDB database operations
- JWT verification
- Role-based authorization
- Equipment management
- Booking operations
- Favorite operations
- Analytics
- Contact operations
- Payment-related backend functionality

---

## 📌 Main Application Sections

### 1. Home Page

The homepage introduces the rEntsy equipment rental marketplace and helps users discover available equipment.

It includes:

- Hero section
- Equipment discovery
- Categories
- Featured equipment
- Rental-focused content
- Responsive navigation
- Call-to-action sections
- Footer

---

### 2. Authentication System

Better Auth handles the application's authentication system.

Users can:

- Register using name, email, and password.
- Sign in using email and password.
- Sign in using Google.
- Sign in using GitHub.
- Log out securely.
- Maintain an authenticated session.
- Access protected dashboard features.

Password validation is implemented during registration.

The authentication system uses MongoDB through the Better Auth MongoDB adapter.

---

### 3. Equipment Discovery

Users can browse equipment available for rental.

Equipment information can include:

- Equipment name
- Category
- Price
- Rental duration
- Description
- Image
- Availability/status
- Owner information

Equipment discovery is designed to work with public API endpoints where authentication is not required.

---

### 4. Equipment Details

Each equipment item has its own detail page.

Users can view:

- Equipment information
- Equipment image
- Category
- Rental price
- Rental duration
- Description
- Booking-related information
- Owner-related information

The equipment detail experience is designed to provide the information needed before starting a rental.

---

### 5. Create Equipment

Authenticated equipment owners can create rental listings.

A listing can contain:

- Equipment name
- Category
- Description
- Image
- Price
- Rental duration
- Equipment-related information

Protected backend routes ensure that only authenticated and authorized users can create equipment.

---

### 6. Manage Equipment

Owners can manage equipment created through their own accounts.

Available operations include:

- View created equipment
- Update equipment
- Delete equipment
- Manage equipment information

Backend ownership validation ensures that users cannot modify or delete equipment belonging to another owner.

---

### 7. Equipment Booking

Authenticated customers can book rental equipment.

The booking flow includes:

1. Select equipment.
2. Review rental information.
3. Submit booking information.
4. Store booking information in MongoDB.
5. Manage booking information from the dashboard.

Protected API endpoints ensure that booking operations are connected with the authenticated user.

---

### 8. My Bookings

Authenticated users can view their booking history.

The booking dashboard can include:

- Equipment information
- Booking information
- Rental price
- Rental duration
- Departure/rental date
- Booking status
- Related payment information

Booking data is retrieved from the backend using the authenticated user's identity.

---

### 9. Favorites

Authenticated users can save equipment for later.

Users can:

- Add equipment to favorites.
- Remove equipment from favorites.
- View their favorite equipment.

Favorite operations are protected by authentication.

---

### 10. Payment System

rEntsy includes a Stripe-based payment flow for rental-related payments.

The payment system includes:

- Payment initiation
- Checkout flow
- Payment verification
- Payment status handling
- Backend payment APIs
- Stripe webhook processing

Stripe webhook events are handled by the backend to keep payment-related state synchronized.

---

### 11. Dashboard

The dashboard provides authenticated users with role-based functionality.

Depending on the user's role, the dashboard can provide access to:

- Profile
- Bookings
- Favorites
- Equipment management
- Analytics
- Administrative functionality

---

### 12. Analytics

Protected analytics routes provide platform-related information for dashboard use.

Analytics functionality is handled through the Express backend and MongoDB.

---

### 13. Profile Management

Authenticated users can manage their personal profile.

Profile functionality includes:

- Update name
- Update profile image
- Update phone number
- Update address
- View account information

---

### 14. Theme Customization

The application supports theme customization.

Users can switch between:

- Light mode
- Dark mode

The interface is designed to maintain usability and visual consistency across both themes.

---

## 🔐 Authentication & Security

Security and authorization are important parts of rEntsy.

The application uses Better Auth for authentication and JWT-based verification for protected backend operations.

Security implementations include:

- Better Auth email/password authentication.
- Google OAuth authentication.
- GitHub OAuth authentication.
- Authentication-based access to private dashboard features.
- JWT generation through Better Auth.
- JWT verification through the Express backend.
- JWKS-based public key verification.
- Role-based authorization.
- Customer, owner, and admin access control.
- Backend ownership validation.
- Protected equipment mutations.
- Protected booking operations.
- Protected favorite operations.
- Server-side validation.
- Environment variables for sensitive configuration.
- CORS configuration for frontend/backend communication.

The authentication architecture follows this flow:

```text
User
  |
  v
Better Auth
  |
  v
Session
  |
  v
JWT
  |
  v
Authorization: Bearer <JWT>
  |
  v
Express API
  |
  v
JWT Verification
  |
  v
Role / Ownership Validation
  |
  v
MongoDB Operation
```

---

## 🏗️ Localhost & Production Deployment

rEntsy is configured to run in both local development and production environments.

Environment variables are used to manage:

- Frontend URLs
- Backend API URLs
- MongoDB connections
- Better Auth configuration
- OAuth credentials
- JWT verification configuration
- Stripe configuration
- CORS origins

### Local Development

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:5000` |
| Better Auth | `http://localhost:3000` |
| JWKS Endpoint | `http://localhost:3000/api/auth/jwks` |

### Production — Vercel

| Service | URL |
|---|---|
| Frontend | `https://rentsy-xi.vercel.app/` |
| Backend | `https://rentsy-server.vercel.app/` |
| Better Auth | `https://rentsy-xi.vercel.app/` |
| JWKS Endpoint | `https://rentsy-xi.vercel.app/api/auth/jwks` |

The frontend and backend are deployed separately on Vercel.

Better Auth runs on the frontend application, while the Express server provides the protected REST API and database operations.

---

# ⚙️ Installation & Setup Guide

Want to run rEntsy on your local machine?

Follow the steps below to clone, install, configure, and run both the frontend and backend.

---

## 📋 Prerequisites

Before getting started, make sure you have installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or a MongoDB instance
- Google Cloud Console project for Google OAuth
- GitHub OAuth application
- Stripe account for payment functionality

Use a Node.js version compatible with the project's Next.js version.

---

## 1. Clone the Frontend Repository

Open your terminal and run:

```bash
git clone https://github.com/Rumi-Parvez/rentsy-client.git
```

Navigate to the client directory:

```bash
cd rentsy-client
```

---

## 2. Install Frontend Dependencies

Run:

```bash
npm install
```

This installs the packages defined in `package.json`.

The frontend uses packages including:

- Next.js
- React
- Better Auth
- MongoDB
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Icons
- React Hot Toast
- Recharts
- Embla Carousel
- Stripe-related frontend dependencies where configured

You do not need to install these packages individually.

---

## 3. Configure Frontend Environment Variables

Create a `.env` file in the root directory of the frontend project.

Example:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret

MONGO_DB_CLIENT=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace the placeholder values with your own credentials.

Never commit `.env` files or secrets to GitHub.

---

## 4. Clone the Backend Repository

Open a new terminal window and run:

```bash
git clone https://github.com/Rumi-Parvez/rEntsy-server.git
```

Navigate to the server directory:

```bash
cd rEntsy-server
```

---

## 5. Install Backend Dependencies

Run:

```bash
npm install
```

This installs the backend packages defined in the server's `package.json`.

The backend uses technologies including:

- Express.js
- MongoDB
- JOSE
- CORS
- dotenv
- Stripe
- Node.js

---

## 6. Configure Backend Environment Variables

Create a `.env` file in the root directory of the backend project.

Example:

```env
PORT=5000

MONGODB_CONNECTION=your_mongodb_connection_string

BETTER_AUTH_URL=http://localhost:3000

CLIENT_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Add any additional environment variables required by the current backend configuration.

Make sure the MongoDB connection string points to the database used by the application.

---

## 7. Start the Backend Server

Run:

```bash
npm run dev
```

The backend API should now be available at:

```text
http://localhost:5000
```

Test the backend health endpoint:

```text
http://localhost:5000/
```

---

## 8. Start the Frontend Application

Open another terminal window.

Navigate to the frontend directory:

```bash
cd rentsy-client
```

Run:

```bash
npm run dev
```

The frontend application should now be available at:

```text
http://localhost:3000
```

---

## 9. You're Ready!

If both applications are running successfully, open:

```text
http://localhost:3000
```

You can now:

- Register an account.
- Sign in with email/password.
- Sign in with Google or GitHub.
- Browse equipment.
- View equipment details.
- Save favorites.
- Create equipment as an owner.
- Manage equipment.
- Create bookings.
- Manage bookings.
- Complete supported payment flows.
- Manage your profile.
- Use role-based dashboard features.

---

# 📦 Available Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint |

---

# 📦 Available Backend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the backend development server |
| `npm start` | Starts the backend server in production |

---

# 🔑 Environment Configuration

rEntsy uses separate environment configurations for local development and production deployment.

## Local Development

### Frontend

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend

```env
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
PORT=5000
```

Add the required MongoDB, OAuth, and Stripe environment variables to the appropriate project.

---

## Production Deployment

Configure the following values in the respective Vercel project settings.

### Frontend

```env
BETTER_AUTH_URL=https://rentsy-xi.vercel.app
NEXT_PUBLIC_API_URL=https://rentsy-server.vercel.app/api
```

### Backend

```env
BETTER_AUTH_URL=https://rentsy-xi.vercel.app
CLIENT_URL=https://rentsy-xi.vercel.app
```

Also configure the production:

- MongoDB connection string
- Better Auth secret
- Google OAuth credentials
- GitHub OAuth credentials
- Stripe secret
- Stripe webhook configuration
- Other required environment variables

### Important

The Better Auth URL must match the frontend application that issues the authentication token.

The Express backend uses the Better Auth JWKS endpoint to verify JWT signatures:

```text
https://rentsy-xi.vercel.app/api/auth/jwks
```

The backend must therefore be configured with:

```env
BETTER_AUTH_URL=https://rentsy-xi.vercel.app
```

Never upload `.env` files, API secrets, OAuth secrets, Stripe secrets, or database credentials to GitHub.

---

# 🔗 Backend API Documentation

The Express.js backend provides REST API endpoints for equipment, bookings, favorites, analytics, users, categories, contacts, protected operations, and payment-related functionality.

## General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |

## Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | User-related API operations |
| POST | `/api/users` | Create/sync user data where supported |
| PATCH | `/api/users/:id` | Update user information where supported |

Protected user operations require authentication.

## Equipment

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/equipment` | Retrieve equipment |
| GET | `/api/equipment/:id` | Retrieve equipment details |
| GET | `/api/equipment/categories` | Retrieve equipment categories |
| GET | `/api/equipment/meta` | Retrieve equipment metadata |
| POST | `/api/equipment` | Create equipment |
| PATCH | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |

Public equipment GET endpoints can be accessed without authentication.

Equipment mutations require authentication and appropriate authorization.

## Bookings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | Retrieve bookings |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id` | Update booking information |
| DELETE | `/api/bookings/:id` | Delete/cancel booking where supported |

Booking operations are protected by authentication.

## Favorites

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/favorites` | Retrieve favorites |
| POST | `/api/favorites` | Add equipment to favorites |
| DELETE | `/api/favorites/:id` | Remove a favorite |

## Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Retrieve categories |

## Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/...` | Retrieve protected analytics information |

## Contacts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contacts` | Submit contact information/message |

## Protected Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/protected/...` | Test/protected API operations |

Protected endpoints require a valid JWT.

The backend expects the token through the HTTP Authorization header:

```http
Authorization: Bearer <JWT>
```

---

# 💳 Payment & Stripe Webhook

rEntsy uses Stripe for payment-related functionality.

The backend provides payment-related API functionality and webhook processing.

Stripe webhook events can include:

```text
checkout.session.completed
payment_intent.succeeded
payment_intent.payment_failed
```

For local webhook testing, Stripe CLI can forward webhook events to the local backend.

Example:

```bash
stripe listen --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:5000/api/payments/webhook
```

For production, configure the Stripe webhook endpoint to point to the deployed backend webhook route.

Example:

```text
https://rentsy-server.vercel.app/api/payments/webhook
```

The Stripe webhook route must be configured to verify Stripe webhook signatures correctly.

---

# 🔐 JWT Authentication Flow

The rEntsy authentication architecture separates authentication from backend API authorization.

```text
                User
                  |
                  v
            Better Auth
                  |
                  v
              Session
                  |
                  v
              JWT Token
                  |
                  v
       Authorization: Bearer JWT
                  |
                  v
          Express Backend
                  |
                  v
          JWT Verification
                  |
                  v
       Role / Access Validation
                  |
                  v
               MongoDB
```

Better Auth is responsible for authentication and token generation.

The Express backend does not create the Better Auth session. Instead, it verifies the JWT received from the frontend.

The backend uses the Better Auth JWKS endpoint to validate the token signature.

---

# 🎯 Learning Outcomes

Building rEntsy provided practical experience with:

- Building a full-stack marketplace using Next.js and Express.js.
- Creating a modern responsive UI with Tailwind CSS.
- Implementing authentication with Better Auth.
- Connecting Better Auth with MongoDB.
- Understanding JWT generation and verification.
- Working with JWKS and JOSE.
- Implementing role-based authorization.
- Building protected REST APIs.
- Connecting frontend applications with Express APIs.
- Working with MongoDB collections.
- Implementing equipment CRUD operations.
- Implementing booking functionality.
- Implementing favorites.
- Building role-based dashboards.
- Implementing payment integration with Stripe.
- Handling Stripe webhook events.
- Managing user profiles.
- Implementing analytics APIs.
- Handling loading states and error feedback.
- Using reusable React components.
- Deploying frontend and backend applications using Vercel.
- Configuring local and production environments.

One of the most valuable parts of the project was understanding how authentication, JWT verification, authorization, frontend API communication, database operations, booking workflows, and payment processing work together in a real-world full-stack application.

---

# 🚀 Future Improvements

There is always room to make rEntsy better.

Possible future improvements include:

- Advanced equipment search and filtering.
- Equipment availability calendar.
- Advanced booking date management.
- Rental history and reporting.
- Owner revenue analytics.
- Customer reviews and ratings.
- Equipment location-based discovery.
- Booking notifications and reminders.
- Email notifications.
- Advanced admin analytics.
- Improved payment history.
- More detailed owner dashboards.
- Equipment verification system.
- Rental status tracking.
- Enhanced marketplace search.

---

# 👨‍💻 Developer

**Rumi Parvez**

Full-Stack Web Developer

I enjoy building practical web applications, exploring new technologies, and turning ideas into functional products.

- GitHub: Rumi-Parvez
- Client Repository: rEntsy Client
- Server Repository: rEntsy Server
- Live Website: rEntsy
- Live Backend API: rEntsy Server

---

# 🏁 rEntsy

**Rent Smarter. Manage Better. Build Better.**

rEntsy is a full-stack equipment rental and booking marketplace built with Next.js, React, Better Auth, Node.js, Express.js, MongoDB, JWT, and Stripe.

Built with ❤️ by **Rumi Parvez**
