import React from 'react';

/**
 * High-fidelity vector icons matching the CARZODRIVE 3D service button artwork:
 * 1. Self Drive (Luxury white car front view with glowing cyan LED lights)
 * 2. Car Rental (Luxury car front with radiant cyan key)
 * 3. Bike Rental (Modern sports motorcycle in profile with cyan accents)
 * 4. Driver Rental (Professional chauffeur with peaked cap & steering wheel)
 * 5. Tour Package (Golden sun, mountain peaks, road & airplane)
 */

export const SelfDriveCarIcon = ({ className = 'w-10 h-10', active = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'group-hover:scale-105'}`}
  >
    {/* Ambient Headlight Glow */}
    <ellipse cx="18" cy="38" rx="8" ry="4" fill={active ? '#38BDF8' : '#0284C7'} opacity="0.4" filter="blur(2px)" />
    <ellipse cx="46" cy="38" rx="8" ry="4" fill={active ? '#38BDF8' : '#0284C7'} opacity="0.4" filter="blur(2px)" />

    {/* Car Roof & Windshield Frame */}
    <path
      d="M20 22L24 13C24.5 11.8 25.8 11 27.2 11H36.8C38.2 11 39.5 11.8 40 13L44 22"
      stroke="#94A3B8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#0F172A"
    />
    {/* Windshield Tint */}
    <path
      d="M21.5 21L25 14H39L42.5 21H21.5Z"
      fill="url(#car-windshield-grad)"
      opacity="0.9"
    />
    {/* Windshield reflection glare */}
    <path d="M26 15L23.5 20" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

    {/* Side Mirrors */}
    <path d="M16 23C14 23 13 24.5 14 26L18 27" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="#1E293B" />
    <path d="M48 23C50 23 51 24.5 50 26L46 27" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="#1E293B" />

    {/* Main Hood & Body Shell */}
    <path
      d="M14 27C12 28 10 32 10 37C10 42 12 45 15 46H49C52 45 54 42 54 37C54 32 52 28 50 27L44 24H20L14 27Z"
      fill="url(#car-body-metallic)"
      stroke="#E2E8F0"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Front Grille */}
    <path
      d="M22 36C22 34 24 33 26 33H38C40 33 42 34 42 36L40 42C40 43 39 44 38 44H26C25 44 24 43 24 42L22 36Z"
      fill="#090D16"
      stroke="#38BDF8"
      strokeWidth="1.2"
    />
    {/* Chrome Grille horizontal slat */}
    <line x1="25" y1="37" x2="39" y2="37" stroke="#64748B" strokeWidth="1" />
    <line x1="26" y1="40" x2="38" y2="40" stroke="#64748B" strokeWidth="1" />
    {/* Carzo Center Emblem */}
    <circle cx="32" cy="36.5" r="2" fill="#38BDF8" />

    {/* Sleek LED Headlights */}
    <path
      d="M13 32L21 34C22 34.5 21.5 37 19.5 37.5L14 36.5C12.5 36 12 34 13 32Z"
      fill="#F8FAFC"
      stroke="#38BDF8"
      strokeWidth="1.2"
    />
    <path
      d="M51 32L43 34C42 34.5 42.5 37 44.5 37.5L50 36.5C51.5 36 52 34 51 32Z"
      fill="#F8FAFC"
      stroke="#38BDF8"
      strokeWidth="1.2"
    />
    {/* Headlight inner cyan beams */}
    <circle cx="16.5" cy="34.5" r="1.5" fill="#38BDF8" />
    <circle cx="47.5" cy="34.5" r="1.5" fill="#38BDF8" />

    {/* Lower Bumper & Splitter */}
    <path d="M16 46L20 48H44L48 46" stroke="#00F0FF" strokeWidth="1.8" strokeLinecap="round" />
    {/* Fog lamp accents */}
    <line x1="14" y1="43" x2="18" y2="43" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="46" y1="43" x2="50" y2="43" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Wheels / Tires front */}
    <path d="M12 44V48H16V46" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 46V48H52V44" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

    <defs>
      <linearGradient id="car-body-metallic" x1="10" y1="24" x2="54" y2="47" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.4" stopColor="#E2E8F0" />
        <stop offset="0.8" stopColor="#94A3B8" />
        <stop offset="1" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="car-windshield-grad" x1="25" y1="14" x2="39" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E293B" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
  </svg>
);

export const CarRentalKeyIcon = ({ className = 'w-10 h-10', active = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'group-hover:scale-105'}`}
  >
    {/* Car Base silhouette on left */}
    <g transform="translate(-4, 0)">
      <path
        d="M17 23L20.5 15C21 14 22 13.5 23 13.5H31C32 13.5 33 14 33.5 15L37 23"
        stroke="#94A3B8"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="#0F172A"
      />
      <path d="M18.5 22L21.5 16H32.5L35.5 22H18.5Z" fill="#1E293B" />
      <path
        d="M12 28C11 29 9.5 32 9.5 37C9.5 41 11 44 14 45H36C38 43 40 40 40 37C40 32 39 29 38 28L34 25H16L12 28Z"
        fill="url(#keycar-body-grad)"
        stroke="#E2E8F0"
        strokeWidth="1.8"
      />
      {/* Front lights */}
      <path d="M11 33L17 35C18 35.5 17.5 37.5 16 38L12 37C11 36.5 10.5 35 11 33Z" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="1" />
      <circle cx="14" cy="35.5" r="1.2" fill="#38BDF8" />
      {/* Grille */}
      <rect x="20" y="34" width="10" height="7" rx="1.5" fill="#090D16" stroke="#38BDF8" strokeWidth="1" />
      <line x1="14" y1="45" x2="32" y2="45" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Radiant 3D Cyan Car Key on right */}
    <g transform="translate(14, 10)">
      {/* Key Fob Head Outer Ring */}
      <circle
        cx="32"
        cy="15"
        r="9"
        fill="url(#key-glow-grad)"
        stroke="#00F0FF"
        strokeWidth="2.2"
        className="filter drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
      />
      {/* Key Fob Inner Hole */}
      <circle cx="32" cy="15" r="3.8" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />

      {/* Key Blade extending down */}
      <path
        d="M26 22L18 31C17 32 17 34 18.5 35L20 36.5C21 37.5 22.5 37.5 23.5 36.5L31.5 28.5"
        stroke="#38BDF8"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="#0284C7"
      />
      {/* Key Teeth notches */}
      <path d="M19 32L16 29" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 35L20 33" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Key Emblem Sparkle */}
      <circle cx="32" cy="11.5" r="1.5" fill="#FFFFFF" />
    </g>

    <defs>
      <linearGradient id="keycar-body-grad" x1="9.5" y1="25" x2="40" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.6" stopColor="#CBD5E1" />
        <stop offset="1" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="key-glow-grad" x1="23" y1="6" x2="41" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="0.5" stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
    </defs>
  </svg>
);

export const BikeRentalIcon = ({ className = 'w-10 h-10', active = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'group-hover:scale-105'}`}
  >
    {/* Wheels / Rims with Cyan Neon Rings */}
    {/* Rear Wheel */}
    <circle cx="16" cy="42" r="9" stroke="#E2E8F0" strokeWidth="2.5" fill="#090D16" />
    <circle cx="16" cy="42" r="6" stroke="#00F0FF" strokeWidth="1.8" />
    <circle cx="16" cy="42" r="2.5" fill="#38BDF8" />

    {/* Front Wheel */}
    <circle cx="48" cy="42" r="9" stroke="#E2E8F0" strokeWidth="2.5" fill="#090D16" />
    <circle cx="48" cy="42" r="6" stroke="#00F0FF" strokeWidth="1.8" />
    <circle cx="48" cy="42" r="2.5" fill="#38BDF8" />

    {/* Frame and Swingarm */}
    <path d="M16 42L27 41L24 33L16 42Z" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />

    {/* Engine block */}
    <rect x="25" y="34" width="10" height="9" rx="2" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="27" y1="37" x2="33" y2="37" stroke="#38BDF8" strokeWidth="1" />
    <line x1="27" y1="40" x2="33" y2="40" stroke="#38BDF8" strokeWidth="1" />

    {/* Exhaust Pipe */}
    <path d="M29 42L36 43L20 45" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />

    {/* Fuel Tank & Tail Fairing (Metallic Silver & Cyan) */}
    <path
      d="M17 28L25 28C27 28 29 27 30 25L33 21C34.5 19 37 18 39.5 18H42L44 23L38 29L30 31L20 31L17 28Z"
      fill="url(#bike-tank-grad)"
      stroke="#F1F5F9"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Seat */}
    <path d="M21 28C24 28 26 27 28 27L29 29L22 30Z" fill="#090D16" stroke="#475569" strokeWidth="1" />

    {/* Handlebars & Front Fork */}
    <path d="M48 42L41 21L42 16L40 15" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
    {/* Windscreen visor */}
    <path d="M42 16L46 21H41Z" fill="#0284C7" opacity="0.8" />
    {/* Headlight beam */}
    <polygon points="46,21 54,23 53,26 45,23" fill="#00F0FF" opacity="0.9" />

    <defs>
      <linearGradient id="bike-tank-grad" x1="17" y1="18" x2="44" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.5" stopColor="#E2E8F0" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
  </svg>
);

export const DriverRentalIcon = ({ className = 'w-10 h-10', active = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]' : 'group-hover:scale-105'}`}
  >
    {/* Driver Peaked Uniform Cap */}
    {/* Cap Crown */}
    <path
      d="M22 17C22 13 26 10 32 10C38 10 42 13 42 17L44 19H20L22 17Z"
      fill="url(#driver-cap-grad)"
      stroke="#38BDF8"
      strokeWidth="1.8"
    />
    {/* Cap Visor / Peak */}
    <path
      d="M18 19C24 21 40 21 46 19C48 21 46 23 44 24C36 26 28 26 20 24C18 23 16 21 18 19Z"
      fill="#090D16"
      stroke="#CBD5E1"
      strokeWidth="1.5"
    />
    {/* Pilot Cap Gold/Cyan Badge */}
    <circle cx="32" cy="15" r="2.2" fill="#00F0FF" stroke="#FFFFFF" strokeWidth="1" />

    {/* Head / Face */}
    <path
      d="M25 22C25 20 39 20 39 22V27C39 31 36 34 32 34C28 34 25 31 25 27V22Z"
      fill="#F8FAFC"
      stroke="#94A3B8"
      strokeWidth="1.5"
    />

    {/* Uniform Collar & Shirt */}
    <path
      d="M20 36C16 38 14 43 14 48H50C50 43 48 38 44 36L37 40L32 35L27 40L20 36Z"
      fill="url(#driver-uniform-grad)"
      stroke="#E2E8F0"
      strokeWidth="1.8"
    />
    {/* Tie */}
    <polygon points="32,35 34,42 32,46 30,42" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />

    {/* Professional Steering Wheel in Hands */}
    <g transform="translate(0, 4)">
      {/* Outer Steering Rim */}
      <circle
        cx="32"
        cy="44"
        r="11"
        stroke="#00F0FF"
        strokeWidth="2.8"
        fill="#090D16"
        opacity="0.95"
      />
      {/* Center Steering Hub */}
      <circle cx="32" cy="44" r="3.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.2" />
      {/* Steering Wheel Spokes */}
      <line x1="32" y1="44" x2="32" y2="54" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="32" y1="44" x2="22" y2="40" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="32" y1="44" x2="42" y2="40" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
    </g>

    <defs>
      <linearGradient id="driver-cap-grad" x1="20" y1="10" x2="44" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="driver-uniform-grad" x1="14" y1="35" x2="50" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A" />
        <stop offset="0.5" stopColor="#1E293B" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
  </svg>
);

export const TourPackageIcon = ({ className = 'w-10 h-10', active = false }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'group-hover:scale-105'}`}
  >
    {/* Radiant Golden Sun Rising */}
    <circle cx="32" cy="22" r="7" fill="#F59E0B" stroke="#FDE047" strokeWidth="1.8" />
    {/* Sunrays */}
    <line x1="32" y1="11" x2="32" y2="14" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="14" x2="26" y2="16.5" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="14" x2="38" y2="16.5" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />

    {/* Twin Mountain Summits */}
    {/* Left Mountain */}
    <polygon points="10,48 24,24 38,48" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    {/* Left Snowcap */}
    <polygon points="24,24 28,31 24,30 20,31" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />

    {/* Right Higher Peak */}
    <polygon points="26,48 38,20 54,48" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
    {/* Right Snowcap */}
    <polygon points="38,20 43,28 38,27 33,28" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

    {/* Highway Ribbon Road through Mountains */}
    <path
      d="M16 52C22 50 28 47 32 44C36 41 42 42 50 49"
      stroke="#00F0FF"
      strokeWidth="3"
      strokeLinecap="round"
      className="filter drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]"
    />
    <path
      d="M20 53C24 51 30 48 32 46C35 44 40 45 46 51"
      stroke="#FFFFFF"
      strokeWidth="1"
      strokeDasharray="2 3"
    />

    {/* Ascending Jet Airplane */}
    <g transform="translate(18, 2)">
      {/* Contrail trail */}
      <line x1="16" y1="23" x2="24" y2="17" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
      {/* Fuselage */}
      <path
        d="M24 16L32 10C33 9 34.5 9 35.5 10C36.5 11 36 12.5 35 13.5L29 19L28 24L25 22L26 18L21 16L22 14L27 15L24 16Z"
        fill="#00F0FF"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
