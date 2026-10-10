import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { ALL_CARS, ALL_BIKES } from '../../data/catalog';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { getVehicleWhatsAppMessage } from '../../utils/whatsapp';

export const VehicleDetailSimilar = ({ currentVehicle, onOpenQuickBook }) => {
  const isBike = currentVehicle.vehicleType === 'bike';
  const sourceList = isBike ? ALL_BIKES : ALL_CARS;

  // Filter out current vehicle and pick up to 3 similar
  const similarVehicles = sourceList
    .filter((v) => v.id !== currentVehicle.id)
    .slice(0, 3);

  if (similarVehicles.length === 0) return null;

  return (
    <section className="pt-16 mt-16 border-t border-slate-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-950">
            Similar {isBike ? 'Bikes' : 'Cars'} You Might Like
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Compare other benchmark options available for immediate booking.
          </p>
        </div>
        <Link
          to={isBike ? '/bike-self-ride' : '/car-self-ride'}
          className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarVehicles.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white shadow-sm">
                  {item.badge || item.category}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 text-right">
                <span className="text-lg font-black text-white drop-shadow-md">
                  {item.priceDisplay || item.pricePerDay}
                </span>
                <span className="text-[10px] text-slate-300 ml-1">/ day</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {item.brand}
                  </span>
                  {item.color && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      {item.color}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black text-slate-950 mt-0.5 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h4>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/vehicle/${item.id}`}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-500 font-bold text-xs text-slate-700 hover:text-blue-600 transition-all text-center bg-slate-50 hover:bg-white cursor-pointer"
                >
                  View Details
                </Link>

                <WhatsAppButton
                  message={getVehicleWhatsAppMessage(item)}
                  variant="icon-only"
                  size="md"
                />

                {item.isAvailable !== false && item.availableCount !== 0 ? (
                  <button
                    type="button"
                    onClick={() => onOpenQuickBook?.({ vehicle: item, type: item.vehicleType })}
                    className="py-2.5 px-4 rounded-xl font-black text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                  >
                    Book
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2.5 px-2 rounded-xl font-bold text-xs text-slate-400 bg-slate-100 border border-slate-200 opacity-40 cursor-not-allowed select-none text-center"
                    title="Vehicle is currently not available for booking"
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
