import React from 'react';
import { 
  Gauge, 
  Fuel, 
  Zap, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Cog, 
  Timer,
  Scale,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const VehicleDetailSpecs = ({ vehicle }) => {
  const isBike = vehicle.vehicleType === 'bike';
  const specs = vehicle.specs || {};
  const isAvailable = vehicle.isAvailable !== false && vehicle.availableCount !== 0;

  const bikeEngineDisplay = vehicle.engineCC
    ? `${vehicle.engineCC} cc`
    : vehicle.engineCapacity
    ? (String(vehicle.engineCapacity).includes('cc') ? vehicle.engineCapacity : `${vehicle.engineCapacity} cc`)
    : specs.engine
    ? (String(specs.engine).includes('cc') ? specs.engine : `${specs.engine} cc`)
    : '350 cc';

  // Build spec items dynamically based on available specs
  const specItems = isBike
    ? [
        { label: 'Exterior Color', value: vehicle.color || specs.color || 'Classic Black', icon: Sparkles },
        { label: 'Buying Year', value: vehicle.buyingYear || vehicle.year || 2024, icon: Calendar },
        { label: 'Engine Capacity', value: bikeEngineDisplay, icon: Gauge },
        { label: 'Max Power', value: specs.power || '20.2 HP', icon: Zap },
        { label: 'Fuel Economy', value: specs.mileage || '35-50 km/l', icon: Fuel },
        { label: 'Top Speed', value: specs.topSpeed || '120 km/h', icon: Timer },
        { label: 'Transmission', value: specs.transmission || vehicle.transmission || '5-Speed Manual', icon: Cog },
        { label: 'Braking System', value: specs.brakes || 'Dual-Channel ABS', icon: ShieldCheck },
      ]
    : [
        { label: 'Exterior Color', value: vehicle.color || specs.color || 'Pearl White', icon: Sparkles },
        { label: 'Buying Year', value: vehicle.buyingYear || vehicle.year || 2024, icon: Calendar },
        { label: 'Fleet Units', value: isAvailable ? `${vehicle.availableCount || 1} Available` : '0 Units (Not Available)', icon: isAvailable ? CheckCircle2 : XCircle },
        { label: 'Horsepower', value: specs.power || '115 HP', icon: Zap },
        { label: 'Engine', value: specs.engine || specs.fuelType || vehicle.fuel || '1.5L Engine', icon: Gauge },
        { label: 'Fuel Economy', value: specs.mileage || '20+ km/l', icon: Fuel },
        { label: 'Top Speed', value: specs.topSpeed || '175 km/h', icon: Timer },
        { label: 'Transmission', value: specs.transmission || vehicle.transmission || 'Manual / Auto', icon: Cog },
        { label: 'Seating Capacity', value: specs.seats ? `${specs.seats} Seats` : `${vehicle.seats || 5} Seats`, icon: Users },
        { label: 'Luggage Volume', value: specs.luggage || '3 Large Bags', icon: Briefcase },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-slate-950">Technical Specifications</h3>
        <p className="text-xs text-slate-500 mt-1">
          Factory performance indicators and engineering benchmarks verified by CARZODRIVE.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {specItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-2 hover:border-blue-500/50 hover:bg-blue-50/20 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-blue-600 shadow-xs flex items-center justify-center border border-slate-100">
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 block truncate">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
