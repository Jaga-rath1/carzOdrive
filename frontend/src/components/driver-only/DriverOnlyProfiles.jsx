import React from 'react';
import { ShieldCheck, Star, MapPin, Globe, Clock, UserCheck, ArrowRight, Award } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const DRIVER_PROFILES = [
  {
    id: 'drv-1',
    name: 'Rajesh Sharma',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    experience: '12 Years',
    speciality: 'Luxury & Automatic Cars',
    rating: 4.98,
    reviews: 210,
    languages: 'English, Hindi, Odia',
    location: 'Bhubaneswar Central & Airport',
    availability: 'Available Immediately',
    ratePerDay: '₹1,299 / day',
    verified: true,
  },
  {
    id: 'drv-2',
    name: 'Vikram Pattnaik',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    experience: '9 Years',
    speciality: 'Highway & Outstation Expert',
    rating: 4.96,
    reviews: 164,
    languages: 'English, Hindi, Bengali',
    location: 'Cuttack & Bhubaneswar',
    availability: 'Available Today',
    ratePerDay: '₹1,199 / day',
    verified: true,
  },
  {
    id: 'drv-3',
    name: 'Arun Mohanty',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    experience: '14 Years',
    speciality: 'Coastal Puri & Konark Routes',
    rating: 4.99,
    reviews: 320,
    languages: 'English, Hindi, Telugu',
    location: 'Puri Coastal & Konark Route',
    availability: 'Available Immediately',
    ratePerDay: '₹1,399 / day',
    verified: true,
  },
  {
    id: 'drv-4',
    name: 'Pradeep Jena',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop',
    experience: '8 Years',
    speciality: 'Daily City Commute & Airport',
    rating: 4.94,
    reviews: 142,
    languages: 'English, Hindi',
    location: 'Bhubaneswar Infocity & Patia',
    availability: 'Available Today',
    ratePerDay: '₹1,099 / day',
    verified: true,
  },
  {
    id: 'drv-5',
    name: 'Sunil Routray',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    experience: '11 Years',
    speciality: 'Corporate & VIP Protocol',
    rating: 4.97,
    reviews: 198,
    languages: 'English, Hindi, Odia',
    location: 'Nayapalli & Saheed Nagar',
    availability: 'Available Immediately',
    ratePerDay: '₹1,249 / day',
    verified: true,
  },
  {
    id: 'drv-6',
    name: 'Manoj Tripathy',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    experience: '15 Years',
    speciality: 'Heavy SUVs & Mountain Terrain',
    rating: 4.99,
    reviews: 275,
    languages: 'English, Hindi, Odia',
    location: 'Khandagiri & Airport Ring Road',
    availability: 'Available Today',
    ratePerDay: '₹1,449 / day',
    verified: true,
  },
];

export const DriverOnlyProfiles = ({ onBookDriver }) => {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% POLICE & BACKGROUND VERIFIED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Verified Chauffeurs for Your Car
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Experienced drivers trained in automatic, manual, and luxury vehicles. No car rental required—hire solely the driver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DRIVER_PROFILES.map((driver) => {
            const whatsappMsg = `Hello CARZODRIVE! 👔\nI want to hire driver *${driver.name}* (${driver.experience} experience, ${driver.ratePerDay}) for my personal car. Please confirm availability!`;

            return (
              <div
                key={driver.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.16)] hover:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Profile Photo Header */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Police Verified</span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="text-xs text-slate-300 block uppercase font-bold">Driver Allowance</span>
                    <span className="text-base font-black text-white drop-shadow-md">
                      {driver.ratePerDay}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-950">{driver.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{driver.rating}</span>
                        <span className="text-slate-400 text-[10px]">({driver.reviews})</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg mt-2">
                      <Award className="w-3 h-3" />
                      <span>{driver.speciality}</span>
                    </div>

                    <span className="text-xs text-slate-500 font-medium block mt-1">
                      {driver.experience} Commercial Driving Experience
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{driver.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Languages: {driver.languages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-700 font-semibold">{driver.availability}</span>
                    </div>
                  </div>

                  {/* Actions: Book Driver + WhatsApp Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onBookDriver?.(driver)}
                      className="flex-1 py-3 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group/btn"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Book Driver</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>

                    <WhatsAppButton
                      message={whatsappMsg}
                      variant="icon-only"
                      size="md"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
