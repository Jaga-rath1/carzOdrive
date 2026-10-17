import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../../components/hero/Hero';
import { FeaturedVehiclesSection } from '../../components/home/FeaturedVehiclesSection';
import { WhyChooseSection } from '../../components/home/WhyChooseSection';
import { RentYourCarPromoSection } from '../../components/home/RentYourCarPromoSection';
import { ToursPreviewSection } from '../../components/home/ToursPreviewSection';
import { DriverRegistrationCTA } from '../../components/home/DriverRegistrationCTA';
import { FinalHeroCTA } from '../../components/home/FinalHeroCTA';

export const HomePage = () => {
  const { handleOpenQuickBook, handleOpenSpecs } = useOutletContext() || {};

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO SECTION — CLEAN WHITE & BLUE EXPERIENCE WITH TOP REDIRECT OPTIONS & TRIP BOOKING */}
      <Hero onOpenQuickBook={handleOpenQuickBook} onOpenSpecs={handleOpenSpecs} />

      {/* 2. FEATURED VEHICLES (FILTER TABS & DETAILED VEHICLE CARDS) */}
      <FeaturedVehiclesSection
        onQuickBook={handleOpenQuickBook}
        onViewSpecs={handleOpenSpecs}
      />

      {/* 6. WHY CHOOSE DRIVORA (4 FEATURE BLOCKS WITH LARGE NUMBERS) */}
      <WhyChooseSection />

      {/* 7. RENT YOUR CAR SECTION (DARK/BLUE PROMOTIONAL SECTION) */}
      <RentYourCarPromoSection />

      {/* 8. TOURS & PACKAGES PREVIEW (3 PREMIUM PACKAGES + VIEW ALL CTA) */}
      <ToursPreviewSection />

      {/* 9. DRIVER REGISTRATION CTA (PROFESSIONAL SECTION FOR CHAUFFEURS) */}
      <DriverRegistrationCTA />

      {/* 10. FINAL HERO-STYLE CTA AT THE END OF HOME PAGE */}
      <FinalHeroCTA onOpenQuickBook={handleOpenQuickBook} />
    </div>
  );
};
