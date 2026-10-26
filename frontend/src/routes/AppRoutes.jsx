import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/Home/HomePage';
import { CarSelfRidePage } from '../pages/CarSelfRide/CarSelfRidePage';
import { BikeSelfRidePage } from '../pages/BikeSelfRide/BikeSelfRidePage';
import { CarWithDriverPage } from '../pages/CarWithDriver/CarWithDriverPage';
import { DriverOnlyPage } from '../pages/DriverOnly/DriverOnlyPage';
import { ToursPackagesPage } from '../pages/ToursPackages/ToursPackagesPage';
import { RentYourCarPage } from '../pages/RentYourCar/RentYourCarPage';
import { RentYourBikePage } from '../pages/RentYourBike/RentYourBikePage';
import { DriverRegistrationPage } from '../pages/DriverRegistration/DriverRegistrationPage';
import { AboutPage } from '../pages/About/AboutPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { VehicleDetailPage } from '../pages/VehicleDetail/VehicleDetailPage';
import { TourDetailPage } from '../pages/TourDetail/TourDetailPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { SignupPage } from '../pages/Auth/SignupPage';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/Auth/ResetPasswordPage';
import { MyBookingsPage } from '../pages/MyBookings/MyBookingsPage';
import { BookOnWhatsAppPage } from '../pages/BookOnWhatsApp/BookOnWhatsAppPage';

// Admin Portal Pages
import { AdminLayout } from '../pages/Admin/AdminLayout';
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage';
import { AdminVehiclesPage } from '../pages/Admin/AdminVehiclesPage';
import { AdminBikesPage } from '../pages/Admin/AdminBikesPage';
import { AdminDriversPage } from '../pages/Admin/AdminDriversPage';
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage';
import { AdminVendorFleetPage } from '../pages/Admin/AdminVendorFleetPage';
import { AdminBookingsPage } from '../pages/Admin/AdminBookingsPage';
import { AdminPackagesPage } from '../pages/Admin/AdminPackagesPage';
import { AdminLoginPage } from '../pages/Admin/AdminLoginPage';

// Scroll to top helper when route changes
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
};

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Main prompt routes */}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="bike-self-ride" element={<BikeSelfRidePage />} />
          <Route path="car-self-ride" element={<CarSelfRidePage />} />
          <Route path="car-with-driver" element={<CarWithDriverPage />} />
          <Route path="driver-only" element={<DriverOnlyPage />} />
          <Route path="tours-packages" element={<ToursPackagesPage />} />
          <Route path="rent-your-car" element={<RentYourCarPage />} />
          <Route path="rent-your-bike" element={<RentYourBikePage />} />
          <Route path="driver-registration" element={<DriverRegistrationPage />} />

          {/* Dedicated Individual Detail Pages for Car, Bike, and Tour */}
          <Route path="vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="car/:id" element={<VehicleDetailPage />} />
          <Route path="bike/:id" element={<VehicleDetailPage />} />
          <Route path="tour/:id" element={<TourDetailPage />} />
          <Route path="tours-packages/:id" element={<TourDetailPage />} />

          {/* Customer Booking Voucher & History */}
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="booking-history" element={<MyBookingsPage />} />
          
          {/* Dedicated WhatsApp Direct Booking Page */}
          <Route path="book-on-whatsapp" element={<BookOnWhatsAppPage />} />
          <Route path="whatsapp-booking" element={<BookOnWhatsAppPage />} />
          
          {/* Shorthand / backward compatible aliases */}
          <Route path="bike-rental" element={<BikeSelfRidePage />} />
          <Route path="car-rental" element={<CarSelfRidePage />} />
          <Route path="cars" element={<CarSelfRidePage />} />
          <Route path="bikes" element={<BikeSelfRidePage />} />
          <Route path="tours" element={<ToursPackagesPage />} />
          <Route path="host-bike" element={<RentYourBikePage />} />
          <Route path="rent-bike" element={<RentYourBikePage />} />

          {/* Catch all fallback */}
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="vehicles" element={<AdminVehiclesPage />} />
          <Route path="bikes" element={<AdminBikesPage />} />
          <Route path="packages" element={<AdminPackagesPage />} />
          <Route path="tours" element={<Navigate to="/admin/packages" replace />} />
          <Route path="drivers" element={<AdminDriversPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="vendor-fleet" element={<AdminVendorFleetPage />} />
          <Route path="staff" element={<Navigate to="/admin/users" replace />} />
        </Route>

        {/* Dedicated Auth Routes (Full-Screen Luxury Portal) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
};
