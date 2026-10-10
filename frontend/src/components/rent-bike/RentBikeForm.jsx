import React, { useState } from 'react';
import { Upload, CheckCircle2, ArrowRight } from 'lucide-react';

export const RentBikeForm = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    bikeBrand: '',
    bikeModel: '',
    bikeNumber: '',
    bikeType: 'Commuter',
    manufacturingYear: '2023',
    city: 'Bhubaneswar',
    expectedDailyPrice: '850',
  });
  const [photoSelected, setPhotoSelected] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-7 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
          VEHICLE ENROLLMENT
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
          List Your Bike
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit basic information and our bike operations executive will inspect your vehicle within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-950">Bike Registration Submitted!</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-900">{formData.ownerName || 'Host'}</strong>. Your bike enrollment dossier for <strong className="text-slate-900">{formData.bikeBrand} {formData.bikeModel}</strong> has been received. Our city operations team will contact you at {formData.phone} for the mechanical audit.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-blue-600 hover:underline pt-2 cursor-pointer"
          >
            Submit another bike
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Owner Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                required
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="e.g. Sourav Mohanty"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="sourav@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Bike Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Bike Brand *
              </label>
              <select
                required
                name="bikeBrand"
                value={formData.bikeBrand}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Select Brand</option>
                <option value="Royal Enfield">Royal Enfield</option>
                <option value="Honda">Honda</option>
                <option value="TVS">TVS</option>
                <option value="Yamaha">Yamaha</option>
                <option value="KTM">KTM</option>
                <option value="Bajaj">Bajaj</option>
                <option value="BMW Motorrad">BMW Motorrad</option>
                <option value="Harley-Davidson">Harley-Davidson</option>
                <option value="Suzuki">Suzuki</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Bike Model *
              </label>
              <input
                type="text"
                required
                name="bikeModel"
                value={formData.bikeModel}
                onChange={handleInputChange}
                placeholder="e.g. Classic 350 / Activa 6G"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                required
                name="bikeNumber"
                value={formData.bikeNumber}
                onChange={handleInputChange}
                placeholder="OD-02-AB-1234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Category *
              </label>
              <select
                name="bikeType"
                value={formData.bikeType}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Scooter">Scooter (Activa/Ntorq)</option>
                <option value="Commuter">Commuter (FZ/Pulsar)</option>
                <option value="Cruiser">Cruiser (Royal Enfield)</option>
                <option value="Sports">Sports (KTM/R15)</option>
                <option value="Premium">Premium Superbike</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Mfg Year *
              </label>
              <select
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="850"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Photo Upload (Simulated) */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Upload Bike Photos (Front, Rear, Odometer)
            </label>
            <div
              onClick={() => setPhotoSelected(true)}
              className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
                photoSelected
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50 text-slate-600'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
              <span className="text-xs font-bold block">
                {photoSelected ? '✓ 3 Photos Selected (bike_photos.zip)' : 'Click to Browse Photos (JPG / PNG)'}
              </span>
              <span className="text-[11px] text-slate-500">Max file size: 15MB</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>List My Bike</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
