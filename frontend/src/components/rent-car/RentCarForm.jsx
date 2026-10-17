import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle, Lock } from 'lucide-react';
import { vendorsAPI, uploadsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { AuthRequiredNotice } from '../common/AuthRequiredNotice';
import { RentCarOwnerDetails } from './RentCarOwnerDetails';
import { RentCarVehicleDetails } from './RentCarVehicleDetails';
import { RentCarDocuments } from './RentCarDocuments';
import { RentCarSuccess } from './RentCarSuccess';

export const RentCarForm = () => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleType: 'Sedan',
    manufacturingYear: '2023',
    city: 'Bhubaneswar',
    expectedDailyPrice: '3500',
    imageUrl: '',
    rcDocumentUrl: '',
    insuranceDocumentUrl: '',
    idProofUrl: '',
  });

  // Auto-prefill authenticated user details
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        ownerName: prev.ownerName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        email: prev.email || currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState({});
  const [docErrors, setDocErrors] = useState({});

  const [submitted, setSubmitted] = useState(false);
  const [submittedItem, setSubmittedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const rcFileInputRef = useRef(null);
  const insuranceFileInputRef = useRef(null);
  const idProofFileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setUploadError(null);
    try {
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/cars', prefix: 'car' });
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
      setUploadError(err.message || 'Failed to upload photo to Cloudinary');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocUpload = async (field, file) => {
    if (!file) return;
    setUploadingDoc((prev) => ({ ...prev, [field]: true }));
    setDocErrors((prev) => ({ ...prev, [field]: null }));

    try {
      const res = await uploadsAPI.uploadImage(file, {
        folder: 'carzodrive/vendor-docs',
        prefix: field.replace('Url', ''),
      });
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, [field]: res.data.url }));
      }
    } catch (err) {
      console.error(`Upload error for ${field}:`, err);
      setDocErrors((prev) => ({ ...prev, [field]: err.message || 'Upload failed' }));
    } finally {
      setUploadingDoc((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await vendorsAPI.attachCar({
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        vehicleBrand: formData.vehicleBrand,
        vehicleModel: formData.vehicleModel,
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        manufacturingYear: formData.manufacturingYear,
        expectedDailyPrice: formData.expectedDailyPrice,
        image: formData.imageUrl || undefined,
        rcDocumentUrl: formData.rcDocumentUrl || undefined,
        insuranceDocumentUrl: formData.insuranceDocumentUrl || undefined,
        idProofUrl: formData.idProofUrl || undefined,
      });

      setSubmittedItem(res?.data || null);
      setSubmitted(true);
    } catch (err) {
      console.error('Car hosting submission error:', err);
      setError(err.message || 'Failed to submit car listing application. Please check your network and inputs.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      ownerName: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleNumber: '',
      vehicleType: 'Sedan',
      manufacturingYear: '2023',
      city: 'Bhubaneswar',
      expectedDailyPrice: '3500',
      imageUrl: '',
      rcDocumentUrl: '',
      insuranceDocumentUrl: '',
      idProofUrl: '',
    });
  };

  return (
    <div className="p-7 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] max-w-2xl mx-auto">
      {submitted ? (
        <RentCarSuccess
          formData={formData}
          submittedItem={submittedItem}
          onReset={resetForm}
        />
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
              Vendor Fleet Enrollment
            </span>
            <h2 className="text-2xl font-black text-slate-950 mt-1">
              Rent Your Car to CARZODRIVE
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Earn guaranteed daily or monthly income with verified corporate and tourist rentals.
            </p>
          </div>

          <AuthRequiredNotice
            title="Login Required to Rent Your Car"
            message="Please sign in or create an account to list your vehicle on the CARZODRIVE network. Your application will be safely linked to your host profile."
            className="mb-2"
          />

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <RentCarOwnerDetails
            formData={formData}
            onInputChange={handleInputChange}
          />

          <RentCarVehicleDetails
            formData={formData}
            onInputChange={handleInputChange}
          />

          <RentCarDocuments
            formData={formData}
            fileInputRef={fileInputRef}
            rcFileInputRef={rcFileInputRef}
            insuranceFileInputRef={insuranceFileInputRef}
            idProofFileInputRef={idProofFileInputRef}
            uploadingPhoto={uploadingPhoto}
            uploadError={uploadError}
            uploadingDoc={uploadingDoc}
            docErrors={docErrors}
            onFileChange={handleFileChange}
            onDocUpload={handleDocUpload}
          />

          {/* Submit CTA */}
          <div className="pt-2">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/login"
                  state={{ returnTo: '/rent-your-car' }}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login to Submit Car Listing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  <span>New host partner?</span>
                  <Link
                    to="/signup"
                    state={{ returnTo: '/rent-your-car' }}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Register / Sign Up
                  </Link>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-amber-700 hover:underline font-bold cursor-pointer"
                  >
                    Quick Popup Login
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading || uploadingPhoto}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application to Super Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Car for Verification & Listing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
            <p className="text-[11px] text-slate-400 text-center mt-2">
              By submitting, you confirm ownership or authority to lease this vehicle.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
