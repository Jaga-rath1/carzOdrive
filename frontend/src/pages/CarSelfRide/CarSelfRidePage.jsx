import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CarRideHero } from '../../components/car-ride/CarRideHero';
import { CarRidePerks } from '../../components/car-ride/CarRidePerks';
import { CarRideGrid } from '../../components/car-ride/CarRideGrid';

export const CarSelfRidePage = () => {
  const { handleOpenQuickBook, handleOpenSpecs } = useOutletContext() || {};

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <CarRideHero />

      {/* 2. FLEET PERKS */}
      <CarRidePerks />

      {/* 3. CAR LISTING GRID WITH CATEGORIES & SORT */}
      <CarRideGrid
        onOpenQuickBook={handleOpenQuickBook}
        onOpenSpecs={handleOpenSpecs}
      />
    </div>
  );
};
