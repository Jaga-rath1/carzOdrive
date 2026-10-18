import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, MapPin, Globe, Clock, UserCheck, ArrowRight, Award, Loader2 } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { driversAPI } from '../../services/api';

export const DRIVER_PROFILES = [];

export const DriverOnlyProfiles = ({ onBookDriver }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    driversAPI
      .getAll()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const mapped = res.data.map((d, idx) => {
            const avatarList = [
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
            ];

            const rate = d.pricing?.dailyRate || d.dailyRate || 1199;
            const exp = d.experienceYears || d.experience || 10;
            const spec = d.speciality || (Array.isArray(d.specialties) ? d.specialties[0] : null) || 'Executive Chauffeur';
            const loc = Array.isArray(d.serviceLocations)
              ? d.serviceLocations.join(' & ')
              : Array.isArray(d.serviceArea)
              ? d.serviceArea.join(' & ')
              : 'Bhubaneswar, Cuttack & Airport';

            return {
              id: d._id || d.id,
              rawId: d._id || d.id,
              name: d.name,
              photo: d.photo || d.avatar || avatarList[idx % avatarList.length],
              experience: `${exp} Years`,
              speciality: spec,
              rating: typeof d.rating === 'number' ? d.rating : d.rating?.average || 4.96,
              reviews: d.rating?.count || d.tripsCount || 150,
              languages: Array.isArray(d.languages) ? d.languages.join(', ') : d.languages || 'Odia, Hindi, English',
              location: loc,
              availability: d.status === 'APPROVED' ? 'Available Today' : d.status || 'Available',
              ratePerDay: `₹${rate.toLocaleString('en-IN')} / day`,
              priceNumeric: rate,
              verified: true,
              rawDriver: d,
            };
          });
          setDrivers(mapped);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load drivers from DB:', err);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-slate-500">Loading verified chauffeurs from database...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8">
            <p className="text-slate-600 font-bold text-sm">No drivers currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drivers.map((driver) => {
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
        )}
      </Container>
    </section>
  );
};
