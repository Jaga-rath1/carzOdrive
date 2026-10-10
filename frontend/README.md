# DRIVORA — Premium Car & Bike Rental Platform

DRIVORA is an ultra-premium, modern mobility and rental web platform engineered with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Three.js / React Three Fiber**.

---

## 🚀 Getting Started

To launch the DRIVORA development server locally:

```bash
cd frontend
npm install
npm run dev
```

The application will be live at `http://localhost:5173/`.

To build the production bundle:

```bash
npm run build
```

---

## 🎨 Design Philosophy & Aesthetic System

- **Color Palette**:
  - Obsidian & Midnight Navy bases (`#040711`, `#080E1E`, `#0D172E`)
  - Electric Royal Blue & Cyan Glow accents (`#2563EB`, `#38BDF8`)
  - Crisp typography in Pure White (`#FFFFFF`) and Silver Slate (`#94A3B8`)
- **Visual Elements**:
  - Glassmorphic navigation and card surfaces with subtle frosted backdrops
  - Soft ambient radial glows and crisp borders (`rgba(255, 255, 255, 0.08)`)
  - Interactive 3D concept car rendered via Three.js with orbit controls and star particles
  - Micro-interactions, scroll reveals powered by Framer Motion, and floating trust badges
  - 100% responsive design tested across Desktop, Laptop, Tablet, and Mobile viewports with zero horizontal overflow

---

## 📂 Architecture & Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/               # Button, SectionHeading, Container, Card, Badge, Modal
│   │   ├── navbar/               # Navbar, NavLinks (Mega Menu), MobileMenu
│   │   ├── footer/               # Footer with trust pillars, newsletter & SVG socials
│   │   ├── hero/                 # Hero, HeroSearchWidget, HeroStats
│   │   ├── booking/              # QuickBookingModal, FilterBar
│   │   ├── vehicle/              # VehicleCard, VehicleSpecsModal
│   │   ├── driver/               # DriverCard, ChauffeurPerks
│   │   ├── packages/             # TourCard
│   │   └── animations/           # ThreeCanvas (R3F 3D Model), RevealAnimation, FloatingBadge
│   ├── pages/
│   │   ├── Home/                 # Full landing experience with 3D model & showcases
│   │   ├── CarSelfRide/          # Luxury supercar & executive sedan catalog with filters
│   │   ├── BikeSelfRide/         # High-performance superbike & cruiser fleet
│   │   ├── CarWithDriver/        # Flagship chauffeur-driven fleet & VIP tiers
│   │   ├── DriverOnly/           # On-demand certified chauffeur hire for personal cars
│   │   ├── ToursPackages/        # Curated scenic driving expeditions & itineraries
│   │   ├── RentYourCar/          # Host program & interactive revenue estimator
│   │   ├── DriverRegistration/   # Private chauffeur career application portal
│   │   ├── About/                # Brand manifesto, standards & global metro hubs
│   │   └── Contact/              # 24/7 VIP concierge hotline & priority inquiry form
│   ├── layouts/
│   │   └── MainLayout.jsx        # Master layout orchestrating modals & navigation
│   ├── routes/
│   │   └── AppRoutes.jsx         # Centralized routing with ScrollToTop
│   ├── hooks/
│   │   ├── useScrollPosition.js  # Sticky glass navbar transition
│   │   └── useFilter.js          # Search, category pills, price slider & sorting
│   ├── utils/
│   │   └── formatters.js         # Currency, date, and rating formatters
│   ├── data/
│   │   ├── vehicles.js           # Porsche, Maybach, M8, Urus, Tesla Plaid, etc.
│   │   ├── bikes.js              # Ducati Panigale, BMW S1000RR, Fat Boy, Ninja H2, etc.
│   │   ├── drivers.js            # Vetted VIP chauffeurs with certifications & rates
│   │   ├── packages.js           # Riviera, Alpine Passes, Vineyard tours
│   │   ├── testimonials.js       # Verified client reviews & operational metrics
│   │   └── faqs.js               # Structured FAQ items
│   ├── App.jsx                   # BrowserRouter root provider
│   ├── main.jsx                  # React 19 entry point
│   └── index.css                 # Global design system & utilities
├── tailwind.config.js
└── package.json
```

---

## 🌟 Key Features

1. **Interactive 3D Automotive Canvas**:
   - Built with Three.js, `@react-three/fiber`, and `@react-three/drei`.
   - Features procedural chassis shaders, glowing LED headlights/taillights, cybernetic ring base, floating dust motes, and interactive drag controls with an automatic fallback view.
2. **Interactive Hero Search Widget**:
   - Tab switcher for Car Self-Drive, Bike Self-Ride, Car with Chauffeur, and Hire Driver Only.
   - Live location selection and date/time inputs that prefill the booking process.
3. **Multi-Step Quick Booking System**:
   - Step 1: Fleet selection, date range, pick-up hub, and protection plan selection.
   - Step 2: Guest identification, contact details, and flight/tarmac arrival notes.
   - Step 3: Instant reservation voucher with unique reference code (`DRV-XXXX-EXP`), cost summary, and print action.
4. **Comprehensive Vehicle Inspection Modal**:
   - Technical matrix covering 0-100 acceleration, horsepower, top speed, gearbox, luggage capacity, and complimentary safety gear for superbikes.
5. **Interactive Host Earnings Calculator**:
   - Real-time earnings slider on `/rent-your-car` showing projected monthly returns based on vehicle tier and rental availability.
6. **Executive Driver Rate Calculator**:
   - Real-time calculator on `/driver-only` for full-day, hourly, or outstation driver hire.
