import { useState, useEffect } from 'react';
import { vehiclesAPI, bikesAPI, packagesAPI, driversAPI } from '../../services/api';

export const useQuickBookingFleet = (isOpen) => {
  const [dbCars, setDbCars] = useState([]);
  const [dbBikes, setDbBikes] = useState([]);
  const [dbTours, setDbTours] = useState([]);
  const [dbDrivers, setDbDrivers] = useState([]);
  const [isLoadingFleet, setIsLoadingFleet] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFleet() {
      setIsLoadingFleet(true);
      try {
        const [carsRes, bikesRes, toursRes, driversRes] = await Promise.allSettled([
          vehiclesAPI.getAll(),
          bikesAPI.getAll(),
          packagesAPI.getAll(),
          driversAPI.getAll(),
        ]);

        if (!isMounted) return;

        let cars = [];
        if (carsRes.status === 'fulfilled' && carsRes.value?.data) {
          cars = carsRes.value.data.map((v) => {
            const carCount = v.availableCount ?? v.count ?? (v.isAvailable !== false ? 1 : 0);
            const isAvail = v.isAvailable !== false && carCount > 0 && v.availabilityStatus !== 'UNAVAILABLE';
            return {
              id: v.slug || v._id || v.id,
              _id: v._id || v.id,
              name: v.name,
              brand: v.brand,
              color: v.color || 'Standard',
              isAvailable: isAvail,
              availableCount: carCount,
              availabilityStatus: isAvail ? 'Available' : 'Currently Unavailable',
              image: (v.images && v.images[0]) || v.image || '/images/vehicles/swift-2026-grey.jpg',
              seats: `${v.seats || 5} Seats`,
              priceNumeric: v.pricing?.selfDrive?.daily || v.pricing?.dailyRate || v.pricePerDay || 1499,
              pricePerDay: v.pricing?.selfDrive?.daily || v.pricing?.dailyRate || v.pricePerDay || 1499,
              deposit: v.deposit || `₹${v.depositNumeric || v.securityDeposit || 5000}`,
              depositNumeric: v.depositNumeric || v.securityDeposit || 5000,
              rawVehicle: v,
            };
          });
          setDbCars(cars);
        }

        let bikes = [];
        if (bikesRes.status === 'fulfilled' && bikesRes.value?.data) {
          bikes = bikesRes.value.data.map((b) => {
            const bikeCount = b.availableCount ?? b.count ?? (b.isAvailable !== false ? 1 : 0);
            const isAvail = b.isAvailable !== false && bikeCount > 0 && b.availabilityStatus !== 'UNAVAILABLE';
            return {
              id: b.slug || b._id || b.id,
              _id: b._id || b.id,
              name: b.name,
              brand: b.brand,
              category: b.category || 'Two Wheeler',
              pricePerDay: b.pricing?.daily || b.pricePerDay || 1299,
              deposit: b.deposit || `₹${b.depositNumeric || 2000}`,
              isAvailable: isAvail,
              availableCount: bikeCount,
              availabilityStatus: isAvail ? 'Available' : 'Currently Unavailable',
              image: (b.images && b.images[0]) || b.image || '/images/vehicles/royal-enfield.jpg',
              rawBike: b,
            };
          });
          setDbBikes(bikes);
        }

        let tours = [];
        if (toursRes.status === 'fulfilled' && toursRes.value?.data) {
          tours = toursRes.value.data.map((t) => ({
            id: t.slug || t._id || t.id,
            _id: t._id || t.id,
            title: t.name,
            name: t.name,
            startingPrice: t.startingPrice || `₹${(t.pricing?.adultPrice || 5499).toLocaleString('en-IN')}`,
            priceNumeric: t.pricing?.adultPrice || 5499,
            destination: t.destination || 'Odisha',
            duration: typeof t.duration === 'object' ? `${t.duration.days} Days / ${t.duration.nights} Nights` : (t.duration || '2 Days / 1 Night'),
            image: (t.images && t.images[0]) || t.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
            rawTour: t,
          }));
          setDbTours(tours);
        }

        let drivers = [];
        if (driversRes.status === 'fulfilled' && driversRes.value?.data) {
          drivers = driversRes.value.data.map((d) => ({
            id: d.slug || d._id || d.id,
            _id: d._id || d.id,
            name: d.name,
            phone: d.phone,
            rating: d.rating || 4.9,
            dailyRate: d.pricing?.dailyRate || d.dailyRate || 799,
            priceDisplay: `₹${d.pricing?.dailyRate || d.dailyRate || 799}`,
            experienceYears: d.experienceYears || d.experience || 5,
            badge: d.badge || 'Commercial Pilot',
            isAvailable: d.isAvailable !== false && d.status !== 'UNAVAILABLE',
            status: d.status || 'Active & Verified',
            image: d.image || d.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
            rawDriver: d,
          }));
          setDbDrivers(drivers);
        }
      } catch (err) {
        console.warn('Live fleet pre-fetching error:', err);
      } finally {
        if (isMounted) setIsLoadingFleet(false);
      }
    }

    if (isOpen) {
      loadFleet();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return {
    dbCars,
    dbBikes,
    dbTours,
    dbDrivers,
    isLoadingFleet,
  };
};
