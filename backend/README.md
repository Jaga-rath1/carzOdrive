# CarzoDrive Backend API

Node.js + Express + MongoDB backend for the CarzoDrive rental platform.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run seed:admin   # Create initial Super Admin
npm run dev          # Development server (nodemon)
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) |
| `FRONTEND_URL` | Allowed CORS origin |
| `CASHFREE_APP_ID` | Cashfree App ID |
| `CASHFREE_SECRET_KEY` | Cashfree Secret Key |
| `CASHFREE_WEBHOOK_SECRET` | Cashfree Webhook Secret |
| `CASHFREE_ENVIRONMENT` | `sandbox` or `production` |
| `SUPER_ADMIN_EMAIL` | Initial super admin email (seed only) |
| `SUPER_ADMIN_PASSWORD` | Initial super admin password (seed only) |

## Super Admin Setup

1. Set `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME` in `.env`
2. Run: `npm run seed:admin`
3. **Change the password immediately after first login**
4. The seed script is idempotent — it will not create a second Super Admin

## Cashfree Sandbox Setup

1. Create a Cashfree account at https://www.cashfree.com
2. Go to Dashboard → API Keys → Test/Sandbox mode
3. Copy App ID and Secret Key to `.env`
4. Set `CASHFREE_ENVIRONMENT=sandbox`
5. For webhooks: expose local server with ngrok and set as notify_url

## API Base URL

All endpoints: `GET /api/v1/...`

### Health
- `GET /api/v1/health` — Server health
- `GET /api/v1/health/database` — Database connectivity

### Auth
- `POST /api/v1/auth/register` — Customer registration
- `POST /api/v1/auth/login` — Login (all roles)
- `POST /api/v1/auth/refresh` — Refresh access token
- `POST /api/v1/auth/logout` — Logout
- `POST /api/v1/auth/forgot-password` — Request password reset
- `POST /api/v1/auth/reset-password` — Reset password
- `POST /api/v1/auth/change-password` — Change password (auth)

### Users
- `GET /api/v1/users/me` — Own profile
- `PUT /api/v1/users/me` — Update profile
- `GET /api/v1/users` — Admin: list users
- `GET /api/v1/users/:id` — Admin: get user
- `PATCH /api/v1/users/:id/status` — Admin: suspend/activate

### Admins (SUPER_ADMIN only)
- `POST /api/v1/admins` — Create admin
- `GET /api/v1/admins` — List admins
- `PATCH /api/v1/admins/:id/status` — Suspend/activate admin

### Vendors
- `POST /api/v1/vendors/apply` — Apply as vendor (CUSTOMER)
- `GET /api/v1/vendors/me` — Own vendor profile (VENDOR)
- `PUT /api/v1/vendors/me` — Update vendor profile (VENDOR)
- `GET /api/v1/vendors` — Admin list
- `POST /api/v1/vendors/:id/approve` — Admin approve
- `POST /api/v1/vendors/:id/reject` — Admin reject
- `POST /api/v1/vendors/:id/suspend` — Admin suspend
- `POST /api/v1/vendors/:id/reactivate` — Admin reactivate

### Vehicles (Cars)
- `GET /api/v1/vehicles` — Public search
- `GET /api/v1/vehicles/:id` — Public get
- `GET /api/v1/vehicles/:id/availability` — Check availability
- `POST /api/v1/vehicles` — VENDOR create
- `GET /api/v1/vehicles/vendor/mine` — VENDOR list own
- `PUT /api/v1/vehicles/:id` — VENDOR update
- `PATCH /api/v1/vehicles/:id/publish` — VENDOR publish/unpublish
- `POST /api/v1/vehicles/:id/approve` — Admin approve
- `POST /api/v1/vehicles/:id/reject` — Admin reject

### Bikes
- Same structure as vehicles at `/api/v1/bikes`

### Drivers
- `POST /api/v1/drivers/apply` — Apply as driver
- `GET /api/v1/drivers/me` — Own driver profile
- `PUT /api/v1/drivers/me` — Update driver profile
- `GET /api/v1/drivers` — Admin/vendor list
- `GET /api/v1/drivers/available` — Available drivers by city
- `POST /api/v1/drivers/:id/approve` — Admin approve
- `POST /api/v1/drivers/:id/reject` — Admin reject
- `POST /api/v1/drivers/:id/suspend` — Admin suspend

### Tour Packages
- `GET /api/v1/packages` — Public search
- `GET /api/v1/packages/:id` — Public get
- `GET /api/v1/packages/:id/availability` — Check date availability
- `POST /api/v1/packages` — VENDOR/admin create
- `POST /api/v1/packages/:id/approve` — Admin approve

### Bookings
- `POST /api/v1/bookings/self-drive-car` — Book self-drive car
- `POST /api/v1/bookings/self-drive-bike` — Book self-drive bike
- `POST /api/v1/bookings/car-with-driver` — Book car with driver
- `POST /api/v1/bookings/driver-only` — Book driver only
- `POST /api/v1/bookings/tour-package` — Book tour package
- `GET /api/v1/bookings` — List bookings
- `GET /api/v1/bookings/:id` — Get booking detail
- `PATCH /api/v1/bookings/:id/status` — Update booking status
- `POST /api/v1/bookings/:id/assign-driver` — Admin assign driver
- `POST /api/v1/bookings/:id/pickup-inspection` — Record pickup inspection
- `POST /api/v1/bookings/:id/return-inspection` — Record return inspection

### Quotations
- `POST /api/v1/quotations` — Admin create quotation
- `POST /api/v1/quotations/:id/send` — Admin send
- `GET /api/v1/quotations` — List
- `GET /api/v1/quotations/:id` — Get
- `POST /api/v1/quotations/:id/accept` — Customer accept
- `POST /api/v1/quotations/:id/decline` — Customer decline
- `POST /api/v1/quotations/:id/cancel` — Cancel

### Payments
- `POST /api/v1/payments/online/:bookingId` — Create Cashfree order
- `GET /api/v1/payments/online/verify/:orderId` — Verify payment
- `POST /api/v1/payments/webhook/cashfree` — Cashfree webhook (public)
- `POST /api/v1/payments/offline/:bookingId` — Record offline payment
- `POST /api/v1/payments/:paymentId/verify-offline` — Admin verify offline
- `POST /api/v1/payments/booking/:bookingId/refund` — Admin initiate refund
- `GET /api/v1/payments/booking/:bookingId` — Get payment by booking
- `GET /api/v1/payments` — Admin list

### Reviews
- `POST /api/v1/reviews` — Customer submit review
- `GET /api/v1/reviews` — Admin list
- `GET /api/v1/reviews/resource/:resourceType/:resourceId` — Public reviews
- `PATCH /api/v1/reviews/:id/approve` — Admin approve

### Notifications
- `GET /api/v1/notifications` — Own notifications
- `POST /api/v1/notifications/:id/read` — Mark read
- `POST /api/v1/notifications/read-all` — Mark all read
- `DELETE /api/v1/notifications/:id` — Delete

### Vehicle/Partner Requests
- `POST /api/v1/requests` — Submit request (public)
- `GET /api/v1/requests` — Admin list
- `GET /api/v1/requests/:id` — Admin get
- `PATCH /api/v1/requests/:id/status` — Admin update status

### Reports (Admin only)
- `GET /api/v1/reports/stats` — Overall stats
- `GET /api/v1/reports/bookings` — Booking report
- `GET /api/v1/reports/revenue` — Revenue report
- `GET /api/v1/reports/pending-approvals` — Pending approvals
- `GET /api/v1/reports/vendor/:vendorId` — Vendor report
- `GET /api/v1/reports/refunds` — Refund report

## Authentication

All protected routes require `Authorization: Bearer <accessToken>` header.

Access tokens expire in 15 minutes. Use the `/auth/refresh` endpoint with the refresh token to get a new access token.

## Roles

| Role | Description |
|---|---|
| `SUPER_ADMIN` | Full access, admin management |
| `OPERATIONS_ADMIN` | Vendor/inventory approval, booking management |
| `FINANCE_ADMIN` | Payment verification, refunds, settlements |
| `SUPPORT_ADMIN` | Customer support, booking management |
| `VENDOR` | Manage own inventory and bookings |
| `CUSTOMER` | Book services, manage own bookings |

## Running Tests

```bash
npm test              # Run all tests (uses in-memory MongoDB)
npm run test:watch    # Watch mode
```

Tests cover: health checks, registration, login, role-based access, vendor operations, booking lifecycle, and status transitions.

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production MongoDB connection string (Atlas recommended)
3. Use strong random JWT secrets (min 64 chars)
4. Set `CASHFREE_ENVIRONMENT=production` and production API keys
5. Set `FRONTEND_URL` to your production frontend URL
6. Use a process manager: `pm2 start src/server.js --name carzodrive-api`
7. Configure reverse proxy (nginx) for HTTPS termination
