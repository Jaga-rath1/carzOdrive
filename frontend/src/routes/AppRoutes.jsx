import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
// Booking confirmation page (Preserved as separate page, commented out for now)
// import { BookingConfirmationPage } from '../pages/BookingConfirmation/BookingConfirmationPage';

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

          {/* Booking Confirmation (Commented out as requested for direct WhatsApp flow) */}
          {/* <Route path="booking-confirmation" element={<BookingConfirmationPage />} /> */}
          
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
      </Routes>
    </>
  );
};
