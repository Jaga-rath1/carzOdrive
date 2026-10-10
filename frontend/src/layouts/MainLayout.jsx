import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { QuickBookingModal } from '../components/booking/QuickBookingModal';
import { VehicleSpecsModal } from '../components/vehicle/VehicleSpecsModal';

export const MainLayout = () => {
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [selectedVehicleForBook, setSelectedVehicleForBook] = useState(null);
  const [bookingPrefill, setBookingPrefill] = useState({});

  const [specsModalOpen, setSpecsModalOpen] = useState(false);
  const [selectedVehicleForSpecs, setSelectedVehicleForSpecs] = useState(null);

  const handleOpenQuickBook = (vehicleOrPrefill = null) => {
    if (vehicleOrPrefill?.vehicle) {
      setSelectedVehicleForBook(vehicleOrPrefill.vehicle);
      setBookingPrefill(vehicleOrPrefill);
    } else if (vehicleOrPrefill && (vehicleOrPrefill.id || vehicleOrPrefill.name)) {
      setSelectedVehicleForBook(vehicleOrPrefill);
      setBookingPrefill({ vehicle: vehicleOrPrefill });
    } else if (vehicleOrPrefill) {
      setBookingPrefill(vehicleOrPrefill);
    } else {
      setSelectedVehicleForBook(null);
      setBookingPrefill({});
    }
    setQuickBookOpen(true);
  };

  const handleOpenSpecs = (vehicle) => {
    setSelectedVehicleForSpecs(vehicle);
    setSpecsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar onOpenQuickBook={() => handleOpenQuickBook()} />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <Outlet context={{ handleOpenQuickBook, handleOpenSpecs }} />
      </main>

      {/* Global Interactive Quick Booking Modal */}
      <QuickBookingModal
        isOpen={quickBookOpen}
        onClose={() => setQuickBookOpen(false)}
        initialVehicle={selectedVehicleForBook}
        initialData={bookingPrefill}
      />

      {/* Global Vehicle Specs Inspection Modal */}
      <VehicleSpecsModal
        isOpen={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
        vehicle={selectedVehicleForSpecs}
        onBookNow={(veh) => {
          setSpecsModalOpen(false);
          handleOpenQuickBook(veh);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
