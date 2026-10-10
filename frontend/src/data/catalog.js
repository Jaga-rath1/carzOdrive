import { VEHICLES } from './vehicles';
import { BIKES } from './bikes';
import { ALL_TOUR_PACKAGES } from '../components/packages/ToursGrid';

/**
 * Enhanced Cars catalog for CARZODRIVE Odisha Fleet
 */
export const ALL_CARS = VEHICLES.map((v) => ({
  ...v,
  vehicleType: 'car',
  gallery: [v.image, ...(v.secondaryImages || [v.image])],
  inclusions: [
    'Comprehensive zero-deductible insurance cover',
    'Doorstep delivery at Biju Patnaik Airport (BBI) or Hotels',
    '24/7 dedicated CARZODRIVE roadside emergency assistance',
    'Fastag enabled toll pass with instant recharge',
    'Deeply sanitized cabin & premium car perfume',
  ],
  rules: [
    'Valid driving license (min 1 year driving experience)',
    'Original Aadhaar card or Passport verified at handoff',
    '100% refundable security deposit returned within 2 hours of vehicle drop',
    'Speed limit strictly capped at 100-120 km/h on National Highways for safety',
  ],
}));

/**
 * Enhanced Bikes catalog for CARZODRIVE Odisha Two-Wheeler Fleet
 */
export const ALL_BIKES = BIKES.map((b) => ({
  ...b,
  isAvailable: false,
  availabilityStatus: 'Currently Not Available',
  vehicleType: 'bike',
  gallery: [b.image, b.image],
  inclusions: [
    'Two sanitized ISI certified helmets free with every rental',
    'Waterproof all-weather phone mount for Google Maps navigation',
    '24/7 on-call breakdown assistance across Bhubaneswar & Puri',
    'Third-party road insurance cover included',
    'Full tank handover option available upon request',
  ],
  rules: [
    'Valid two-wheeler driving license required',
    'Govt Photo ID (Aadhaar/Voter ID) verified at pickup',
    'Refundable security deposit returned immediately upon drop-off',
    'Wearing helmet is mandatory under Odisha Motor Vehicle rules',
  ],
}));

/**
 * Universal lookup helper for any Vehicle (Car or Bike)
 */
export const getVehicleById = (idOrSlug) => {
  if (!idOrSlug) return ALL_CARS[0];
  const query = String(idOrSlug).toLowerCase().trim();

  // 1. Direct search in enhanced cars
  let found = ALL_CARS.find(
    (c) =>
      c.id.toLowerCase() === query ||
      c.slug?.toLowerCase() === query ||
      c.name.toLowerCase() === query ||
      c.name.toLowerCase().includes(query)
  );
  if (found) return found;

  // 2. Direct search in enhanced bikes
  found = ALL_BIKES.find(
    (b) =>
      b.id.toLowerCase() === query ||
      b.slug?.toLowerCase() === query ||
      b.name.toLowerCase() === query ||
      b.name.toLowerCase().includes(query)
  );
  if (found) return found;

  // 3. Fallback search in VEHICLES data
  const vFound = VEHICLES.find(
    (v) =>
      v.id.toLowerCase() === query ||
      v.slug?.toLowerCase() === query ||
      v.name.toLowerCase().includes(query)
  );
  if (vFound) {
    return {
      ...vFound,
      vehicleType: 'car',
      gallery: [vFound.image, ...(vFound.secondaryImages || [vFound.image])],
      inclusions: [
        'Comprehensive zero-excess insurance',
        'Doorstep airport or hotel handover',
        '24/7 CARZODRIVE roadside assistance',
      ],
      rules: ['Valid driving license required'],
    };
  }

  // 4. Fallback search in BIKES data
  const bFound = BIKES.find(
    (b) =>
      b.id.toLowerCase() === query ||
      b.slug?.toLowerCase() === query ||
      b.name.toLowerCase().includes(query)
  );
  if (bFound) {
    return {
      ...bFound,
      vehicleType: 'bike',
      gallery: [bFound.image],
      inclusions: [
        'Two sanitized ISI helmets free of charge',
        'Phone mount for GPS navigation',
        '24/7 breakdown assistance',
      ],
      rules: ['Valid two-wheeler driving license required'],
    };
  }

  // 5. Default fallback to first car
  return ALL_CARS[0];
};

/**
 * Universal lookup helper for any Tour Package
 */
export const getTourById = (idOrSlug) => {
  if (!idOrSlug) return null;
  const query = String(idOrSlug).toLowerCase().trim();

  const found = ALL_TOUR_PACKAGES.find(
    (t) => t.id.toLowerCase() === query || t.title.toLowerCase().includes(query)
  );

  return found || ALL_TOUR_PACKAGES[0];
};
