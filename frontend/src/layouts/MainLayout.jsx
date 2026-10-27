import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles, Tag } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { QuickBookingModal } from '../components/booking/QuickBookingModal';
import { VehicleSpecsModal } from '../components/vehicle/VehicleSpecsModal';
import { AuthModal } from '../components/auth/AuthModal';
import { getCurrentUser, getAccessToken } from '../services/api';
import { useDiscount } from '../hooks/useDiscount';

export const MainLayout = () => {
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [selectedVehicleForBook, setSelectedVehicleForBook] = useState(null);
  const [bookingPrefill, setBookingPrefill] = useState({});

  const { isDiscountActive, bannerText, badgeText, discountPercentage } = useDiscount();

  const [specsModalOpen, setSpecsModalOpen] = useState(false);
  const [selectedVehicleForSpecs, setSelectedVehicleForSpecs] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const handleCustomOpenAuth = (e) => {
      const mode = e?.detail?.mode || 'login';
      handleOpenAuth(mode);
    };

    window.addEventListener('carzodrive-open-auth', handleCustomOpenAuth);
    return () => {
      window.removeEventListener('carzodrive-open-auth', handleCustomOpenAuth);
    };
  }, []);

  const handleOpenQuickBook = (vehicleOrPrefill = null) => {
    const isAuth = Boolean(getCurrentUser() && getAccessToken());
    if (!isAuth) {
      handleOpenAuth('login');
      return;
    }

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
      {/* Dynamic Storewide Discount Announcement Banner */}
      {isDiscountActive && discountPercentage > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm z-50">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 shrink-0" />
          <span className="truncate max-w-xl">
            {bannerText || `Limited Offer: Enjoy ${discountPercentage}% OFF on all vehicle reservations across Odisha!`}
          </span>
          <span className="shrink-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider shadow-2xs">
            {badgeText || `${discountPercentage}% OFF`} AUTO-APPLIED
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenQuickBook={() => handleOpenQuickBook()}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <Outlet context={{ handleOpenQuickBook, handleOpenSpecs, handleOpenAuth }} />
      </main>

      {/* Global Interactive Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(data) => {
          const user = data?.user || data;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('carzodrive-auth-change', { detail: { user } }));
          }
          setAuthModalOpen(false);
        }}
      />

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
