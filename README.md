# 🚗 CARZODRIVE — Premium Car & Bike Rental Platform

<p align="center">
  <img src="https://img.shields.io/badge/Platform-CARZODRIVE-2563EB?style=for-the-badge&logo=car&logoColor=white" alt="CarzoDrive" />
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind-38BDF8?style=for-the-badge&logo=react&logoColor=white" alt="Frontend" />
  <img src="https://img.shields.io/badge/3D%20Graphics-Three.js%20%7C%20R3F-black?style=for-the-badge&logo=three.js&logoColor=white" alt="ThreeJS" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Backend" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Payment-Cashfree%20PG-orange?style=for-the-badge" alt="Cashfree" />
</p>

---

## 📌 Overview

**CARZODRIVE** is an ultra-modern, full-stack vehicle rental and mobility ecosystem built for self-drive cars, supercars, superbikes, chauffeur-driven luxury sedans, on-demand certified drivers, and curated road-trip expeditions. 

The platform features an immersive 3D automotive experience (powered by Three.js & React Three Fiber), a frictionless booking engine, real-time host revenue calculators, document/KYC verification pipelines, a comprehensive Multi-Role Admin Dashboard, Cashfree payment gateway integration, and automated email notifications.

---

## ✨ Key Features

### 👤 Customer Facing
- **🏎️ Self-Drive Fleet (Cars & Bikes)**: Browse luxury sedans, electric supercars, and high-performance bikes with specifications (0-100 km/h, HP, top speed, gearbox).
- **👔 Chauffeur-Driven & Driver-Only Hire**: Book luxury rides with vetted VIP chauffeurs or hire personal professional chauffeurs on an hourly/daily basis.
- **🗺️ Curated Tour Packages**: Explore scenic road trips, hill station drives, and coastal expeditions with pre-planned itineraries.
- **🌐 3D Interactive Car Showcase**: Real-time 3D chassis inspection powered by `@react-three/fiber` and `@react-three/drei`.
- **💳 Cashfree Payment Gateway**: Seamless checkout with UPI, NetBanking, Credit/Debit cards, plus offline payment verification options.
- **📄 Digital Booking Voucher**: Instant reservation confirmation with printable booking passes and lifecycle status tracking (`/my-bookings`).
- **🤝 Host / Partner Programs**:
  - `Rent Your Car`: Interactive earnings calculator and vehicle listing submission with RC/Insurance uploads.
  - `Rent Your Bike`: Host superbike onboarding portal.
  - `Driver Registration`: Chauffeur application portal with license & Aadhaar/ID upload.

### 🛡️ Admin & Operational Portal (`/admin`)
- **📊 Real-Time Analytics Dashboard**: Total revenue, active bookings, fleet utilization, and pending partner requests.
- **🚘 Fleet Management**: Approve, reject, publish, or suspend car and bike inventory.
- **📑 Document & KYC Approvals**: Verify host documents (RC, Insurance, PUC) and driver licenses with Cloudinary integration.
- **👨‍✈️ Driver Assignment**: Dispatch certified drivers to customer reservations.
- **💵 Financial & Refund Management**: Monitor Cashfree transactions, offline payment clearances, and initiate refunds.
- **🔐 Multi-Role Access Control (RBAC)**: `SUPER_ADMIN`, `OPERATIONS_ADMIN`, `FINANCE_ADMIN`, `SUPPORT_ADMIN`, `VENDOR`, and `CUSTOMER`.

---

## 🏗️ Tech Stack & Architecture

```
CARZODRIVE PLATFORM
│
├── frontend/                     # React 19 Client (SPA)
│   ├── Vite                      # Ultra-fast bundler & HMR
│   ├── Tailwind CSS              # Modern glassmorphism & responsive design
│   ├── Framer Motion             # Micro-interactions & animated reveals
│   ├── Three.js & R3F            # 3D interactive car canvas
│   ├── React Router v7           # Client-side routing with deep link support
│   └── Lucide React              # Sleek SVG icon library
│
└── backend/                      # REST API Server
    ├── Node.js & Express         # Modular MVC API architecture
    ├── MongoDB & Mongoose        # Document database with schemas & indexing
    ├── JWT & Bcrypt              # Secure access & refresh tokens
    ├── Cashfree PG SDK           # Payment orders, webhooks & refund APIs
    ├── Cloudinary                # Media & KYC document storage
    ├── Nodemailer                # Transactional booking & password reset emails
    └── Jest & Supertest          # Automated unit & integration tests
```

---

## 📁 Repository Structure

```text
Car Rental Platform/
├── frontend/                   # Client application
│   ├── public/                 # Static assets, logos & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI, Navbar, Hero, Booking, 3D Canvas
│   │   ├── pages/              # Home, Catalog, Auth, Admin, Detail pages
│   │   ├── layouts/            # Master layout & Admin layout
│   │   ├── routes/             # AppRoutes & protected routes
│   │   ├── hooks/              # Custom hooks (filters, scroll, auth)
│   │   ├── utils/              # API helpers, formatters
│   │   └── data/               # Default fleet, testimonials, FAQs
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── config/             # DB, Cashfree, Cloudinary & Mailer configs
│   │   ├── controllers/        # Request handlers (auth, booking, admin, etc.)
│   │   ├── models/             # Mongoose data models
│   │   ├── routes/             # Express API route declarations
│   │   ├── middleware/         # Auth, RBAC, file upload & validator guards
│   │   ├── services/           # Payment, email & notification services
│   │   ├── scripts/            # Seed initial admin & purge scripts
│   │   └── server.js           # Server entry point
│   ├── tests/                  # Jest test suites
│   └── package.json
│
├── .gitignore                  # Git ignore rules for monorepo
├── package.json                # Root convenience scripts
├── vercel.json                 # Vercel deployment configuration
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have installed on your machine:
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm** or **yarn** / **pnpm**
- **Git**
- **MongoDB Atlas** account (or local MongoDB)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Jaga-rath1/carzOdrive.git
cd carzOdrive
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Open `backend/.env` and configure your credentials:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/carzodrive?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters_long
JWT_EXPIRES_IN=30d
JWT_REFRESH_EXPIRES_IN=60d

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Cashfree Payments (Sandbox)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_WEBHOOK_SECRET=your_cashfree_webhook_secret
CASHFREE_ENVIRONMENT=sandbox

# Super Admin Seed Credentials
SUPER_ADMIN_EMAIL=admin@carzodrive.com
SUPER_ADMIN_PASSWORD=AdminPassword@123
SUPER_ADMIN_NAME=Super Admin

# Cloudinary (Image & Document uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=carzodrive

# Nodemailer / Email (Optional for testing)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="CARZODRIVE Concierge" <support@carzodrive.com>
```

Seed the default Super Admin:

```bash
npm run seed:admin
```

Start the backend development server:

```bash
npm run dev
# Server will run on: http://localhost:5000
# Health check: http://localhost:5000/api/v1/health
```

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Ensure `frontend/.env` contains:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_CONTACT_PHONE=7377733391
VITE_WHATSAPP_NUMBER=917377733391
VITE_CONTACT_EMAIL=support@carzodrive.com
```

Launch the frontend client:

```bash
npm run dev
# App will run at: http://localhost:5173
```

---

## 🔑 Default Super Admin Login

Once you run `npm run seed:admin` inside `backend/`:
- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@carzodrive.com` (or the email specified in `.env`)
- **Password**: `AdminPassword@123` (or the password specified in `.env`)

> ⚠️ **Important**: Change your default admin password immediately after first login.

---

## 📡 API Overview (Backend)

Base URL: `http://localhost:5000/api/v1`

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/health` | Server status check |
| **Auth** | `POST` | `/auth/register` | Customer sign-up |
| **Auth** | `POST` | `/auth/login` | Login (Customer/Vendor/Admin) |
| **Auth** | `POST` | `/auth/refresh` | Refresh expired JWT token |
| **Auth** | `POST` | `/auth/forgot-password` | Request password reset OTP |
| **Vehicles** | `GET` | `/vehicles` | Public search & filter cars |
| **Vehicles** | `POST` | `/vehicles` | Add vehicle (Vendor/Admin) |
| **Bikes** | `GET` | `/bikes` | Public search & filter bikes |
| **Drivers** | `POST` | `/drivers/apply` | Driver onboarding registration |
| **Packages**| `GET` | `/packages` | Public tours & holiday packages |
| **Bookings**| `POST` | `/bookings/self-drive-car` | Create self-drive car booking |
| **Bookings**| `POST` | `/bookings/car-with-driver`| Book chauffeur ride |
| **Payments**| `POST` | `/payments/online/:bookingId`| Create Cashfree order session |
| **Payments**| `GET` | `/payments/online/verify/:orderId`| Verify payment completion |
| **Admin**   | `GET` | `/reports/stats` | Admin KPI & analytics report |

---

## 🧪 Running Tests

The backend includes test coverage with Jest and in-memory MongoDB:

```bash
cd backend
npm test
```

---

## 🌐 Deployment

### Frontend (Vercel)
This repository includes a root `vercel.json` configured for single-page routing:
1. Connect the GitHub repo to **Vercel**.
2. Framework Preset: **Vite**.
3. Root Directory: `./` (or `frontend`).
4. Set Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://your-api.onrender.com/api/v1`)
5. Click **Deploy**.

### Backend (Render / Railway / VPS)
1. Deploy the `backend/` directory to **Render** or **Railway**.
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Configure all environment variables from `.env.example`.
5. Update `FRONTEND_URL` to match your Vercel domain.

---

## 🛠️ GitHub Workflow Commands

To push changes to GitHub:

```bash
# Check status
git status

# Stage all files
git add .

# Commit with a clear message
git commit -m "feat: complete CARZODRIVE rental platform with 3D showcase & admin dashboard"

# Push to your active branch (e.g., Jagan or main)
git push origin Jagan
```

---

## 📄 License & Attribution

This project is proprietary software built for **CARZODRIVE**. All rights reserved.
Developed with ❤️ by the CarzoDrive engineering team.
#   c a r z O d r i v e  
 