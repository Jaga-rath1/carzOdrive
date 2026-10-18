import React from 'react';

export const RentCarVehicleDetails = ({ formData, onInputChange }) => {
  return (
    <>
      {/* Vehicle Brand & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Vehicle Brand *
          </label>
          <select
            required
            name="vehicleBrand"
            value={formData.vehicleBrand}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">Select Brand</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Tata">Tata Motors</option>
            <option value="Mahindra">Mahindra</option>
            <option value="Toyota">Toyota</option>
            <option value="Kia">Kia</option>
            <option value="Honda">Honda</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Vehicle Model *
          </label>
          <input
            type="text"
            required
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={onInputChange}
            placeholder="e.g. Creta SX / Thar / Fortuner"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Reg No, Body Type, Year */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Registration Number *
          </label>
          <input
            type="text"
            required
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={onInputChange}
            placeholder="OD-02-AB-1234"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Body Type *
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="Compact SUV">Compact SUV</option>
            <option value="Full SUV">Full-Size SUV (7 Seater)</option>
            <option value="Luxury">Luxury Sedan / Convertible</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Mfg Year *
          </label>
          <select
            name="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </div>

      {/* City & Expected Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            City *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
            <option value="Cuttack">Cuttack, Odisha</option>
            <option value="Puri">Puri, Odisha</option>
            <option value="Rourkela">Rourkela, Odisha</option>
            <option value="Kolkata">Kolkata, WB</option>
            <option value="Bengaluru">Bengaluru, KA</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Expected Daily Price (₹) *
          </label>
          <input
            type="number"
            name="expectedDailyPrice"
            value={formData.expectedDailyPrice}
            onChange={onInputChange}
            placeholder="3500"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
    </>
  );
};
