import React from 'react';
import { Award, Star, Globe, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const CHAUFFEUR_CARS = [
  {
    id: 'ch-car-1',
    name: 'Toyota Innova Crysta',
    type: 'VIP Executive MPV',
    seats: '7 Recliner Seats',
    price: '₹4,499 / day',
    image: '/images/vehicles/toyota-innova.jpg',
    driver: {
      name: 'Provided by Company',
      experience: '12+ Years Experience',
      rating: 4.98,
      languages: 'Odia, Hindi, English',
      availability: 'Assigned by Company',
    },
  },
  {
    id: 'ch-car-2',
    name: 'Mahindra Scorpio-N',
    type: 'Commanding VIP SUV',
    seats: '7 Seats',
    price: '₹4,199 / day',
    image: '/images/vehicles/mahindra-scorpio.jpg',
    driver: {
      name: 'Provided by Company',
      experience: '9+ Years Experience',
      rating: 4.96,
      languages: 'Odia, Hindi, Bengali',
      availability: 'Assigned by Company',
    },
  },
  {
    id: 'ch-car-3',
    name: 'Toyota Fortuner 4x4',
    type: 'Flagship Dignitary SUV',
    seats: '7 Luxury Seats',
    price: '₹6,999 / day',
    image: '/images/vehicles/toyota-fortuner.jpg',
    driver: {
      name: 'Provided by Company',
      experience: '14+ Years Experience',
      rating: 4.99,
      languages: 'Odia, Hindi, English',
      availability: 'Assigned by Company',
    },
  },
  {
    id: 'ch-car-4',
    name: 'Maruti Suzuki Dzire',
    type: 'Executive City Sedan',
    seats: '5 Seats',
    price: '₹2,499 / day',
    image: '/images/vehicles/maruti-dzire.jpg',
    driver: {
      name: 'Provided by Company',
      experience: '8+ Years Experience',
      rating: 4.94,
      languages: 'Odia, Hindi',
      availability: 'Assigned by Company',
    },
  },
];

export const CarDriverFleetGrid = ({ onSelectCar }) => {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Prestige Cars & Master Chauffeurs
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Hand-picked executive vehicles paired with experienced, vetted drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CHAUFFEUR_CARS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.15)] hover:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Vehicle Image Header */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white">
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="text-xl font-black text-white drop-shadow-md">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.seats}</p>
                </div>

                {/* Driver Information Card Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-black text-slate-900">
                        Driver: {item.driver.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.driver.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1">
                    <div>Exp: <strong className="text-slate-900">{item.driver.experience}</strong></div>
                    <div>Status: <span className="text-emerald-600 font-bold">{item.driver.availability}</span></div>
                    <div className="col-span-2 flex items-center gap-1 text-slate-500">
                      <Globe className="w-3 h-3 text-blue-600" />
                      <span>Languages: {item.driver.languages}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectCar(item.name)}
                    className="flex-1 py-3.5 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>Reserve Chauffeur</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <WhatsAppButton
                    message={`Hello CARZODRIVE! I want to book a chauffeur-driven car: ${item.name} (${item.type}) with driver ${item.driver.name}.`}
                    variant="icon-only"
                    size="md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
