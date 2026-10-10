import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CarDriverHero } from '../../components/car-driver/CarDriverHero';
import { CarDriverPerks } from '../../components/car-driver/CarDriverPerks';
import { CarDriverFleetGrid } from '../../components/car-driver/CarDriverFleetGrid';
import { CarDriverBookingBar } from '../../components/car-driver/CarDriverBookingBar';

export const CarWithDriverPage = () => {
  const { handleOpenQuickBook } = useOutletContext() || {};
  const [selectedCar, setSelectedCar] = useState('Hyundai Creta (2026)');

  const handleSelectCar = (carName) => {
    setSelectedCar(carName);
    document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <CarDriverHero />

      {/* 2. CHAUFFEUR PERKS */}
      <CarDriverPerks />

      {/* 3. FLEET GRID WITH CHAUFFEURS */}
      <CarDriverFleetGrid onSelectCar={handleSelectCar} />

      {/* 4. CHAUFFEUR BOOKING BAR */}
      <CarDriverBookingBar
        selectedCar={selectedCar}
        onQuickBook={handleOpenQuickBook}
      />
    </div>
  );
};
