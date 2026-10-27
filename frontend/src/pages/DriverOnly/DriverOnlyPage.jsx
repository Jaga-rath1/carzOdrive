import React, { useState } from 'react';
import { DriverOnlyHero } from '../../components/driver-only/DriverOnlyHero';
import { DriverOnlyHowItWorks } from '../../components/driver-only/DriverOnlyHowItWorks';
import { DriverOnlyServices } from '../../components/driver-only/DriverOnlyServices';
import { DriverOnlyProfiles } from '../../components/driver-only/DriverOnlyProfiles';
import { DriverBookingModal } from '../../components/driver-only/DriverBookingModal';

export const DriverOnlyPage = () => {
  const [selectedService, setSelectedService] = useState('airport-transfer');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const handleBookDriver = (driver) => {
    setSelectedDriver(driver);
    setIsDriverModalOpen(true);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO — YOUR CAR. OUR DRIVER. */}
      <DriverOnlyHero />

      {/* 2. HOW IT WORKS (ZERO CAR RENTAL, ONLY DRIVER HIRE) */}
      <DriverOnlyHowItWorks />

      {/* 3. DRIVER SERVICE CATEGORIES */}
      <DriverOnlyServices
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      {/* 4. VERIFIED DRIVER PROFILES WITH DEDICATED DRIVER BOOKING & WHATSAPP */}
      <DriverOnlyProfiles onBookDriver={handleBookDriver} />

      {/* 5. DEDICATED DRIVER BOOKING MODAL (NO CAR RENTAL AT ALL) */}
      <DriverBookingModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
};
