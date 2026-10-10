import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BikeRideHero } from '../../components/bike-ride/BikeRideHero';
import { BikeRideHowItWorks } from '../../components/bike-ride/BikeRideHowItWorks';
import { BikeRideGrid } from '../../components/bike-ride/BikeRideGrid';

export const BikeSelfRidePage = () => {
  const { handleOpenQuickBook } = useOutletContext() || {};

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <BikeRideHero />

      {/* 2. HOW IT WORKS */}
      <BikeRideHowItWorks />

      {/* 3. BIKE LISTING & CATEGORY FILTER */}
      <BikeRideGrid onOpenQuickBook={handleOpenQuickBook} />
    </div>
  );
};
