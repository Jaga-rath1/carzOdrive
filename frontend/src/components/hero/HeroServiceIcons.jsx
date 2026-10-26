import React from 'react';
import { ShieldCheck, UserCheck, Bike, Compass } from 'lucide-react';

/**
 * Premium custom automotive SVG icon for Self-Drive Cars
 * Features a modern sports car front with aerodynamic windshield, LED headlights, and grille
 */
export const SelfDriveCarIcon = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Aerodynamic windshield & roofline */}
    <path d="M5.5 10L7.2 5.5C7.5 4.6 8.4 4 9.4 4H14.6C15.6 4 16.5 4.6 16.8 5.5L18.5 10" />
    {/* Sleek sports car body */}
    <path d="M3 12.5C3 11.4 3.9 10.5 5 10.5H19C20.1 10.5 21 11.4 21 12.5V15.5C21 16.6 20.1 17.5 19 17.5H18.5V16C18 16 17.5 15.5 17 15.5H7C6.5 15.5 6 16 5.5 16V17.5H5C3.9 17.5 3 16.6 3 15.5V12.5Z" />
    {/* Modern Dual LED Headlights */}
    <path d="M5.5 12.5H7.5M16.5 12.5H18.5" strokeWidth="2.2" />
    {/* Center Sports Grille */}
    <path d="M9.5 14.5H14.5" strokeWidth="1.6" />
    {/* Aerodynamic Side Mirrors */}
    <path d="M2.5 10H3.5M20.5 10H21.5" strokeWidth="2" />
    {/* Wheels / Ground Stance */}
    <rect x="4.5" y="17.5" width="2.5" height="2" rx="0.8" fill="currentColor" />
    <rect x="17" y="17.5" width="2.5" height="2" rx="0.8" fill="currentColor" />
  </svg>
);

export const ChauffeurIcon = ShieldCheck;
export const DriverPilotIcon = UserCheck;
export const BikeFleetIcon = Bike;
export const TourPackageIcon = Compass;
