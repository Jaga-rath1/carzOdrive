import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Car, 
  FileText, 
  Camera, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  FileCheck 
} from 'lucide-react';

export const DriverRegForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    phone: '',
    email: '',
    dob: '',
    city: 'Bhubaneswar',
    
    // Step 2: Driving Details
    drivingExperience: '5-8 Years',
    licenseNumber: '',
    licenseType: 'Commercial Transport (HMV / LMV)',
    vehicleType: 'Executive Sedans & Luxury SUVs',
    languages: ['English', 'Hindi'],

    // Step 3: Documents
    drivingLicenseDoc: null,
    idProofDoc: null,
    profilePhotoDoc: null,
    addressProofDoc: null,

    // Step 4: Confirmation
    agreeTerms: false,
  });

  const availableLanguages = [
    'English', 'Hindi', 'Odia', 'Bengali', 'Telugu', 'Tamil', 'Marathi', 'Punjabi'
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return { ...prev, languages: prev.languages.filter((l) => l !== lang) };
      }
      return { ...prev, languages: [...prev.languages, lang] };
    });
  };

  const handleFileUploadSim = (docKey, fileName) => {
    setFormData((prev) => ({
      ...prev,
      [docKey]: fileName || 'document_uploaded.pdf',
    }));
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    { number: '01', title: 'Personal', label: 'Personal Details' },
    { number: '02', title: 'Driving', label: 'Driving Details' },
    { number: '03', title: 'Documents', label: 'Upload Documents' },
    { number: '04', title: 'Review', label: 'Review & Submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* PROGRESS INDICATOR */}
      <div className="mb-10 sm:mb-12">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum || isSubmitted;

            return (
              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm transition-all duration-300 border ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : isActive
                      ? 'bg-slate-950 border-slate-950 text-white ring-4 ring-blue-100 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : step.number}
                </div>
                <span className={`text-[11px] sm:text-xs font-bold mt-2 truncate w-full ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Track Line */}
        <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${isSubmitted ? 100 : (currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="p-7 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        {isSubmitted ? (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                Application Transmitted
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Welcome to the CARZODRIVE Chauffeur Fleet
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.name || 'Partner'}</strong>. Your application dossier has been submitted. Our Operations Team in {formData.city} will review your documents and reach out within 24–48 hours.
              </p>
            </div>

            {/* Application Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">Primary Contact</span>
                <span className="font-bold text-slate-900">{formData.phone || '+91 73777 33391'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">City Hub</span>
                <span className="font-bold text-slate-900">{formData.city}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-semibold">Verification Status</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Under Document Review
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md inline-flex items-center justify-center gap-2"
              >
                <span>Return to Home</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                Submit Another Registration
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    STEP 01 OF 04
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 mt-1">
                    Personal Details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Please enter your legal name and contact details as they appear on your government IDs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Rajesh Kumar Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="rajesh.driver@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => handleInputChange('dob', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">Must be at least 23 years old</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Operational City *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="Bhubaneswar">Bhubaneswar, Odisha</option>
                          <option value="Cuttack">Cuttack, Odisha</option>
                          <option value="Puri">Puri, Odisha</option>
                          <option value="Rourkela">Rourkela, Odisha</option>
                          <option value="Kolkata">Kolkata, West Bengal</option>
                          <option value="Bengaluru">Bengaluru, Karnataka</option>
                          <option value="Hyderabad">Hyderabad, Telangana</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Driving Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DRIVING DETAILS */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    STEP 02 OF 04
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 mt-1">
                    Driving Details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Share your professional driving experience and vehicle proficiencies.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Driving Experience *
                      </label>
                      <select
                        value={formData.drivingExperience}
                        onChange={(e) => handleInputChange('drivingExperience', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="3-5 Years">3 - 5 Years</option>
                        <option value="5-8 Years">5 - 8 Years (Preferred)</option>
                        <option value="8-12 Years">8 - 12 Years (Senior Chauffeur)</option>
                        <option value="12+ Years">12+ Years (Master Chauffeur)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Driver License Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                          placeholder="OD-02-20180012345"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        License Type *
                      </label>
                      <select
                        value={formData.licenseType}
                        onChange={(e) => handleInputChange('licenseType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Commercial Transport (HMV / LMV)">Commercial Transport (HMV / LMV)</option>
                        <option value="Light Motor Vehicle (LMV-TR)">Light Motor Vehicle (LMV-TR)</option>
                        <option value="Heavy Passenger Vehicle (HPV)">Heavy Passenger Vehicle (HPV)</option>
                        <option value="Private Non-Transport LMV (5+ Yrs)">Private Non-Transport LMV (5+ Yrs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Vehicle Type Proficiency *
                      </label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Executive Sedans & Luxury SUVs">Executive Sedans & Luxury SUVs</option>
                        <option value="Premium Sedans (BMW / Mercedes / Audi)">Ultra-Luxury Sedans (Mercedes/BMW)</option>
                        <option value="Full-Size SUVs (Fortuner / Defender)">Full-Size SUVs (Fortuner / Defender)</option>
                        <option value="All Passenger Vehicles (Auto & Manual)">All Passenger Vehicles (Auto & Manual)</option>
                      </select>
                    </div>
                  </div>

                  {/* Languages Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Languages Spoken * (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {availableLanguages.map((lang) => {
                        const isSelected = formData.languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {lang} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DOCUMENTS */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    STEP 03 OF 04
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 mt-1">
                    Document Verification
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Upload clear scans or photos for identity and license verification. (Simulated upload)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Driving License */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-all text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Driving License *</span>
                      <span className="text-[11px] text-slate-500 block">Front & Back scan (PDF, JPG)</span>
                    </div>
                    {formData.drivingLicenseDoc ? (
                      <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{formData.drivingLicenseDoc}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFileUploadSim('drivingLicenseDoc', 'driving_license_valid.pdf')}
                        className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
                      >
                        Choose File
                      </button>
                    )}
                  </div>

                  {/* 2. ID Proof */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-all text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Government ID Proof *</span>
                      <span className="text-[11px] text-slate-500 block">Aadhaar card or Passport</span>
                    </div>
                    {formData.idProofDoc ? (
                      <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{formData.idProofDoc}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFileUploadSim('idProofDoc', 'aadhaar_card_scan.pdf')}
                        className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
                      >
                        Choose File
                      </button>
                    )}
                  </div>

                  {/* 3. Profile Photo */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-all text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Profile Photo *</span>
                      <span className="text-[11px] text-slate-500 block">Recent front portrait photo</span>
                    </div>
                    {formData.profilePhotoDoc ? (
                      <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{formData.profilePhotoDoc}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFileUploadSim('profilePhotoDoc', 'profile_photo.jpg')}
                        className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
                      >
                        Choose File
                      </button>
                    )}
                  </div>

                  {/* 4. Address Proof */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-all text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Address Proof *</span>
                      <span className="text-[11px] text-slate-500 block">Electricity bill or Rent agreement</span>
                    </div>
                    {formData.addressProofDoc ? (
                      <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{formData.addressProofDoc}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleFileUploadSim('addressProofDoc', 'address_proof.pdf')}
                        className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
                      >
                        Choose File
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW & DECLARATION */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    STEP 04 OF 04
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 mt-1">
                    Review & Confirmation
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Please verify your application details before final transmission.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Summary: Personal Details */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" /> 01 Personal Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Name</span>
                        <span className="font-bold text-slate-900">{formData.name || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Phone</span>
                        <span className="font-bold text-slate-900">{formData.phone || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Email</span>
                        <span className="font-bold text-slate-900 truncate block">{formData.email || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">City</span>
                        <span className="font-bold text-slate-900">{formData.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary: Driving Details */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-blue-600" /> 02 Driving Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Experience</span>
                        <span className="font-bold text-slate-900">{formData.drivingExperience}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">License No</span>
                        <span className="font-mono font-bold text-slate-900">{formData.licenseNumber || 'OD-02-20180012345'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Vehicle Category</span>
                        <span className="font-bold text-slate-900 truncate block">{formData.vehicleType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary: Documents */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" /> 03 Documents
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[10px] block font-bold">Driving License</span>
                        <span className="font-bold text-emerald-600 text-xs">✓ Attached</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[10px] block font-bold">ID Proof</span>
                        <span className="font-bold text-emerald-600 text-xs">✓ Attached</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[10px] block font-bold">Profile Photo</span>
                        <span className="font-bold text-emerald-600 text-xs">✓ Attached</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[10px] block font-bold">Address Proof</span>
                        <span className="font-bold text-emerald-600 text-xs">✓ Attached</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms declaration */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed font-medium">
                        I certify that all details and submitted documents are authentic and valid. I agree to CARZODRIVE's Chauffeur Code of Conduct and authorize background verification.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.agreeTerms}
                    className={`px-9 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer ${
                      formData.agreeTerms
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>Submit Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
