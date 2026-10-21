import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { BHUBANESWAR_LOCATIONS, SERVICE_OPTIONS } from '../../config/bookingConfig';
import { formatCurrency } from '../../utils/formatters';
import { resolveVehicleImageUrl } from '../../utils/documentUtils';
import { getQuickBookingWhatsAppMessage, openWhatsAppChat } from '../../utils/whatsapp';
import { paymentsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { BookingStepServiceItem } from './BookingStepServiceItem';
import { BookingStepGuestReview } from './BookingStepGuestReview';
import { BookingStepConfirmation } from './BookingStepConfirmation';
import { useQuickBookingFleet } from './useQuickBookingFleet';

const getTodayOffset = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const QuickBookingModal = ({
  isOpen,
  onClose,
  initialVehicle = null,
  initialData = {},
}) => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [step, setStep] = useState(1);

  // Live Database Fleet via Hook
  const { dbCars, dbBikes, dbTours, dbDrivers } = useQuickBookingFleet(isOpen);

  // 1. Service Type selection
  const [selectedService, setSelectedService] = useState('self-drive-car');

  // 2. Selected contextual item
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedChauffeurCar, setSelectedChauffeurCar] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [userCarModel, setUserCarModel] = useState('');

  // 3. Location fields (Bhubaneswar Hubs)
  const [pickupLocation, setPickupLocation] = useState('SUM Hospital');
  const [dropoffLocation, setDropoffLocation] = useState('Same as Pick-up Address');

  // 4. Dates & Optional Protection
  const [pickupDate, setPickupDate] = useState(getTodayOffset(1));
  const [returnDate, setReturnDate] = useState(getTodayOffset(3));
  const [includeProtection, setIncludeProtection] = useState(false);

  const [guestName, setGuestName] = useState(() => currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(() => currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState(() => currentUser?.phone || '');
  const [guestNotes, setGuestNotes] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');

  // Auto-sync guest fields if user logs in
  useEffect(() => {
    if (currentUser) {
      if (!guestName && currentUser.name) setGuestName(currentUser.name);
      if (!guestEmail && currentUser.email) setGuestEmail(currentUser.email);
      if (!guestPhone && currentUser.phone) setGuestPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  // 6. 3-Way Payment Section: 'full' | 'partial' | 'offline'
  const [paymentMode, setPaymentMode] = useState('full');
  const [onlineMethod, setOnlineMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  // Auto-select initial item or fallback to DB fleet
  useEffect(() => {
    if (!isOpen) return;

    if (dbCars.length > 0 && !selectedCar) setSelectedCar(dbCars[0]);
    if (dbCars.length > 0 && !selectedChauffeurCar) setSelectedChauffeurCar(dbCars[0]);
    if (dbBikes.length > 0 && !selectedBike) setSelectedBike(dbBikes[0]);
    if (dbTours.length > 0 && !selectedTour) setSelectedTour(dbTours[0]);
    if (dbDrivers.length > 0 && !selectedDriver) setSelectedDriver(dbDrivers[0]);

    const targetService = initialData?.serviceType || initialVehicle?.serviceType || initialVehicle?.type;
    const targetItem = initialVehicle || initialData?.vehicle;

    if (targetItem) {
      if (targetService === 'self-drive-bike') {
        const found = dbBikes.find((b) =>
          (targetItem._id && b._id === targetItem._id) ||
          (targetItem.id && b.id === targetItem.id) ||
          b.name === targetItem.name
        );
        setSelectedBike(found || targetItem);
      } else if (targetService === 'tour-packages') {
        const found = dbTours.find((t) =>
          (targetItem._id && t._id === targetItem._id) ||
          (targetItem.id && t.id === targetItem.id) ||
          t.name === targetItem.name
        );
        setSelectedTour(found || targetItem);
      } else if (targetService === 'driver-only') {
        const found = dbDrivers.find((d) =>
          (targetItem._id && d._id === targetItem._id) ||
          (targetItem.id && d.id === targetItem.id) ||
          d.name === targetItem.name
        );
        setSelectedDriver(found || targetItem);
      } else if (targetService === 'car-with-driver') {
        const found = dbCars.find((c) =>
          (targetItem._id && c._id === targetItem._id) ||
          (targetItem.id && c.id === targetItem.id) ||
          c.name === targetItem.name
        );
        setSelectedChauffeurCar(found || targetItem);
      } else {
        const found = dbCars.find((c) =>
          (targetItem._id && c._id === targetItem._id) ||
          (targetItem.id && c.id === targetItem.id) ||
          c.name === targetItem.name
        );
        setSelectedCar(found || targetItem);
      }
    }

    if (targetService) setSelectedService(targetService);
    if (initialData?.pickupDate) setPickupDate(initialData.pickupDate);
    if (initialData?.returnDate) setReturnDate(initialData.returnDate);
    if (initialData?.location || initialData?.pickupLocation) {
      const loc = initialData.location || initialData.pickupLocation;
      if (BHUBANESWAR_LOCATIONS.includes(loc)) setPickupLocation(loc);
    }
    if (initialData?.dropLocation || initialData?.dropoffLocation) {
      const dropLoc = initialData.dropLocation || initialData.dropoffLocation;
      if (dropLoc === 'Same as Pick-up Address' || dropLoc === 'Same as Pickup' || dropLoc === pickupLocation) {
        setDropoffLocation('Same as Pick-up Address');
      } else if (BHUBANESWAR_LOCATIONS.includes(dropLoc)) {
        setDropoffLocation(dropLoc);
      }
    }
  }, [initialVehicle, initialData, isOpen, dbCars, dbBikes, dbTours, dbDrivers]);

  // Days calculation
  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
  }, [pickupDate, returnDate]);

  const currentService = useMemo(() => {
    return SERVICE_OPTIONS.find((s) => s.id === selectedService) || SERVICE_OPTIONS[0];
  }, [selectedService]);

  const effectivePickupLocation = pickupLocation;
  const effectiveDropoffLocation = dropoffLocation === 'Same as Pick-up Address' ? pickupLocation : dropoffLocation;

  const { currentItemName, currentItemImage, ratePerDay, deposit, isAvailable } = useMemo(() => {
    switch (selectedService) {
      case 'car-with-driver': {
        const car = selectedChauffeurCar || dbCars[0];
        const rawPricing = car?.rawVehicle?.pricing?.withDriver?.daily;
        const fallbackPrice = car?.priceNumeric ? car.priceNumeric + 700 : 3499;
        return {
          currentItemName: car?.name ? `${car.name} (with Chauffeur)` : 'Executive Car (with Chauffeur)',
          currentItemImage: resolveVehicleImageUrl(car?.image, '/images/vehicles/toyota-innova.jpg'),
          ratePerDay: rawPricing || fallbackPrice,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: car?.isAvailable !== false && (car?.availableCount ?? 1) > 0 && car?.availabilityStatus !== 'UNAVAILABLE',
        };
      }
      case 'driver-only': {
        const driver = selectedDriver || dbDrivers[0];
        return {
          currentItemName: driver?.name ? `${driver.name} (Verified Commercial Pilot)` : 'Verified Driver (Provided by Company)',
          currentItemImage: driver?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
          ratePerDay: driver?.dailyRate || 799,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: true,
        };
      }
      case 'self-drive-bike': {
        const bike = selectedBike || dbBikes[0];
        const parsed = typeof bike?.pricePerDay === 'number'
          ? bike.pricePerDay
          : parseInt(String(bike?.pricePerDay || '1299').replace(/[^0-9]/g, ''), 10) || 1299;
        return {
          currentItemName: bike?.name || 'Self-Drive Two-Wheeler',
          currentItemImage: resolveVehicleImageUrl(bike?.image, '/images/vehicles/royal-enfield.jpg'),
          ratePerDay: parsed,
          deposit: bike?.deposit || '₹2,000',
          isAvailable: bike?.isAvailable !== false && (bike?.availableCount ?? 1) > 0 && bike?.availabilityStatus !== 'UNAVAILABLE',
        };
      }
      case 'tour-packages': {
        const tour = selectedTour || dbTours[0];
        const parsed = typeof tour?.priceNumeric === 'number'
          ? tour.priceNumeric
          : parseInt(String(tour?.startingPrice || '5499').replace(/[^0-9]/g, ''), 10) || 5499;
        return {
          currentItemName: tour?.title || tour?.name || 'Bhubaneswar Heritage Escape',
          currentItemImage: resolveVehicleImageUrl(tour?.image, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'),
          ratePerDay: parsed,
          deposit: '₹0 (Zero Deposit)',
          isAvailable: true,
        };
      }
      case 'self-drive-car':
      default: {
        const car = selectedCar || dbCars[0];
        let rate = 2999;
        if (typeof car?.priceNumeric === 'number' && car.priceNumeric > 0) {
          rate = car.priceNumeric;
        } else if (typeof car?.pricePerDay === 'string') {
          const parsed = parseInt(car.pricePerDay.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(parsed) && parsed > 0) rate = parsed;
        } else if (typeof car?.pricePerDay === 'number' && car.pricePerDay > 0) {
          rate = car.pricePerDay < 1000 ? car.pricePerDay * 80 : car.pricePerDay;
        }
        return {
          currentItemName: car?.name || 'Swift 2026',
          currentItemImage: resolveVehicleImageUrl(car?.image, '/images/vehicles/swift-2026-grey.jpg'),
          ratePerDay: rate,
          deposit: car?.depositNumeric ? `₹${car.depositNumeric}` : (car?.deposit || '₹5,000'),
          isAvailable: car?.isAvailable !== false && (car?.availableCount ?? 1) > 0 && car?.availabilityStatus !== 'UNAVAILABLE',
        };
      }
    }
  }, [selectedService, selectedCar, selectedChauffeurCar, selectedDriver, selectedBike, selectedTour, dbCars]);

  const subtotal = ratePerDay * (selectedService === 'tour-packages' ? 1 : days);
  const insurancePerDay = selectedService === 'driver-only' || selectedService === 'tour-packages' ? 0 : 499;
  const insuranceCost = includeProtection ? insurancePerDay * days : 0;
  const total = subtotal + insuranceCost;

  const partialPercentage = 0.25;
  const partialAmount = Math.max(499, Math.round(total * partialPercentage));
  const remainingAmount = Math.max(0, total - partialAmount);

  const amountDueNow = paymentMode === 'full' ? total : paymentMode === 'partial' ? partialAmount : 0;
  const amountDueAtPickup = paymentMode === 'full' ? 0 : paymentMode === 'partial' ? remainingAmount : total;

  const handleProceedToDetails = (e) => {
    e.preventDefault();
    if (!isAvailable) return;
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setPaymentError(null);

    if (!guestName.trim()) {
      setPaymentError('Please enter your full name as on your ID or driving license.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.replace(/[^0-9]/g, '').length < 10) {
      setPaymentError('Please enter a valid 10-digit WhatsApp/phone number.');
      return;
    }
    if (paymentMode !== 'offline' && (!guestEmail.trim() || !guestEmail.includes('@'))) {
      setPaymentError('Please enter a valid email address to receive your payment confirmation.');
      return;
    }

    const getActiveVehicleId = () => {
      if (selectedService === 'self-drive-car') return selectedCar?._id || selectedCar?.id;
      if (selectedService === 'car-with-driver') return selectedChauffeurCar?._id || selectedChauffeurCar?.id;
      if (selectedService === 'self-drive-bike') return selectedBike?._id || selectedBike?.id;
      if (selectedService === 'tour-packages') return selectedTour?._id || selectedTour?.id;
      return selectedDriver?._id || selectedDriver?.id;
    };

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const activeVehicleId = getActiveVehicleId();
      const checkoutPayload = {
        serviceType: selectedService,
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        guestEmail: guestEmail.trim() || `${guestPhone.replace(/[^0-9]/g, '')}@offline.carzodrive.com`,
        guestNotes: guestNotes.trim(),
        userCarModel: userCarModel?.trim() || undefined,
        vehicleId: activeVehicleId,
        packageId: selectedService === 'tour-packages' ? (selectedTour?._id || selectedTour?.packageId || selectedTour?.id || activeVehicleId) : undefined,
        tourDate: selectedService === 'tour-packages' ? pickupDate : undefined,
        vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
        vehicleImage: currentItemImage,
        pickupLocation: effectivePickupLocation,
        dropoffLocation: effectiveDropoffLocation,
        pickupDate,
        returnDate,
        days: selectedService === 'tour-packages' ? 1 : days,
        includeProtection,
        paymentMode,
        onlineMethod: paymentMode === 'offline' ? 'whatsapp' : onlineMethod,
        upiApp: onlineMethod === 'upi' ? upiApp : undefined,
        totalAmount: total,
        paidAmount: amountDueNow,
        balanceAmount: amountDueAtPickup,
        securityDeposit: deposit,
      };

      const res = await paymentsAPI.processCheckout(checkoutPayload);
      const resData = res?.data || res || {};
      const bookingData = resData.booking || resData;
      const paymentData = resData.payment || {};

      const finalBookingNumber = resData.bookingNumber || bookingData.bookingNumber || ('CZ-' + Math.floor(1000 + Math.random() * 9000));
      const finalPaymentNumber = resData.paymentNumber || paymentData.paymentNumber || ('PAY-' + Math.floor(1000 + Math.random() * 9000));
      const finalTxnId = resData.transactionId || paymentData.transactionId || (paymentMode === 'offline' ? 'PAY_ON_PICKUP' : 'TXN-' + Math.floor(100000 + Math.random() * 900000));

      setBookingCode(finalBookingNumber);
      setPaymentNumber(finalPaymentNumber);
      setTransactionId(finalTxnId);

      if (paymentMode === 'offline') {
        const waMsg = getQuickBookingWhatsAppMessage({
          serviceName: currentService?.label,
          vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
          userCarModel,
          pickupDate,
          returnDate,
          days: selectedService === 'tour-packages' ? 1 : days,
          location: effectivePickupLocation,
          dropLocation: effectiveDropoffLocation,
          protection: includeProtection ? 'Zero-Excess Damage Waiver' : 'Standard / None',
          deposit,
          total: formatCurrency(total),
          paymentMode: 'Offline Payment (Pay on Pickup via Cash / UPI)',
          paidNow: '₹0 (Zero Advance Online)',
          balanceOnPickup: formatCurrency(total),
          bookingCode: finalBookingNumber,
          guestName,
          guestPhone,
          guestEmail,
          notes: guestNotes,
        });
        openWhatsAppChat(waMsg);
      }

      setStep(3);
    } catch (err) {
      console.error('Checkout processing error:', err);
      setPaymentError(err.message || 'Payment processing failed. Please try again or choose Offline Payment.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setIsProcessingPayment(false);
    setPaymentError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={step === 3 ? 'Reservation Confirmed' : 'Instant Booking & Reservation'}
      subtitle={
        step === 1 ? 'Step 1 of 2: Service, Vehicle & Bhubaneswar Location' :
          step === 2 ? 'Step 2 of 2: Guest Details & Handover Notes' :
            'Your white-glove booking reservation is locked and verified.'
      }
      maxWidth="max-w-2xl"
    >
      {/* Step Indicator Header */}
      {step < 3 && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              1
            </span>
            <span className={step >= 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Service, Fleet & Location
            </span>
          </div>
          <div className="h-[1px] flex-1 mx-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              2
            </span>
            <span className={step >= 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
              Guest Verification
            </span>
          </div>
        </div>
      )}

      {/* STEP 1: Service, Item Selection & Bhubaneswar Locations */}
      {step === 1 && (
        <BookingStepServiceItem
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          currentService={currentService}
          currentItemName={currentItemName}
          currentItemImage={currentItemImage}
          ratePerDay={ratePerDay}
          deposit={deposit}
          isAvailable={isAvailable}
          dbCars={dbCars}
          dbBikes={dbBikes}
          dbTours={dbTours}
          dbDrivers={dbDrivers}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          selectedChauffeurCar={selectedChauffeurCar}
          setSelectedChauffeurCar={setSelectedChauffeurCar}
          selectedBike={selectedBike}
          setSelectedBike={setSelectedBike}
          selectedTour={selectedTour}
          setSelectedTour={setSelectedTour}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          dropoffLocation={dropoffLocation}
          setDropoffLocation={setDropoffLocation}
          pickupDate={pickupDate}
          setPickupDate={setPickupDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          includeProtection={includeProtection}
          setIncludeProtection={setIncludeProtection}
          insurancePerDay={insurancePerDay}
          insuranceCost={insuranceCost}
          days={days}
          total={total}
          userCarModel={userCarModel}
          effectivePickupLocation={effectivePickupLocation}
          effectiveDropoffLocation={effectiveDropoffLocation}
          onProceed={handleProceedToDetails}
        />
      )}

      {/* STEP 2: Guest Details & 3-Way Payment Option */}
      {step === 2 && (
        <BookingStepGuestReview
          currentItemName={currentItemName}
          effectivePickupLocation={effectivePickupLocation}
          guestName={guestName}
          setGuestName={setGuestName}
          guestEmail={guestEmail}
          setGuestEmail={setGuestEmail}
          guestPhone={guestPhone}
          setGuestPhone={setGuestPhone}
          guestNotes={guestNotes}
          setGuestNotes={setGuestNotes}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          paymentError={paymentError}
          total={total}
          partialAmount={partialAmount}
          remainingAmount={remainingAmount}
          amountDueNow={amountDueNow}
          amountDueAtPickup={amountDueAtPickup}
          onlineMethod={onlineMethod}
          setOnlineMethod={setOnlineMethod}
          upiApp={upiApp}
          setUpiApp={setUpiApp}
          isProcessingPayment={isProcessingPayment}
          isAuthenticated={isAuthenticated}
          openAuthModal={openAuthModal}
          onBack={() => setStep(1)}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {/* STEP 3: Reservation Confirmation Receipt */}
      {step === 3 && (
        <BookingStepConfirmation
          paymentMode={paymentMode}
          bookingCode={bookingCode}
          paymentNumber={paymentNumber}
          transactionId={transactionId}
          guestName={guestName}
          guestPhone={guestPhone}
          guestEmail={guestEmail}
          guestNotes={guestNotes}
          currentService={currentService}
          currentItemName={currentItemName}
          userCarModel={userCarModel}
          pickupDate={pickupDate}
          returnDate={returnDate}
          selectedService={selectedService}
          days={days}
          effectivePickupLocation={effectivePickupLocation}
          effectiveDropoffLocation={effectiveDropoffLocation}
          includeProtection={includeProtection}
          amountDueNow={amountDueNow}
          amountDueAtPickup={amountDueAtPickup}
          remainingAmount={remainingAmount}
          total={total}
          deposit={deposit}
          onResetAndClose={resetAndClose}
          onViewBooking={() => {
            resetAndClose();
            navigate(`/my-bookings?code=${encodeURIComponent(bookingCode)}`, {
              state: {
                bookingCode,
                phone: guestPhone,
                email: guestEmail,
              },
            });
          }}
        />
      )}
    </Modal>
  );
};
