import React, { useState, useRef, useEffect } from 'react';
import { uploadsAPI, driversAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { DriverStepIndicator } from './DriverStepIndicator';
import { DriverStepPersonal } from './DriverStepPersonal';
import { DriverStepDriving } from './DriverStepDriving';
import { DriverStepDocuments } from './DriverStepDocuments';
import { DriverStepReview } from './DriverStepReview';
import { DriverRegSuccess } from './DriverRegSuccess';

export const DriverRegForm = () => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedDriver, setSubmittedDriver] = useState(null);

  // File Input Refs
  const licenseInputRef = useRef(null);
  const idProofInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);
  const addressProofInputRef = useRef(null);

  // Upload States
  const [uploadingDoc, setUploadingDoc] = useState({
    drivingLicenseDoc: false,
    idProofDoc: false,
    profilePhotoDoc: false,
    addressProofDoc: false,
  });

  const [uploadErrors, setUploadErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    city: 'Bhubaneswar',
    drivingExperience: '5-8 Years',
    licenseNumber: '',
    licenseType: 'Commercial Transport (HMV / LMV)',
    vehicleType: 'Executive Sedans & Luxury SUVs',
    languages: ['English', 'Hindi'],
    drivingLicenseDoc: null,
    idProofDoc: null,
    profilePhotoDoc: null,
    addressProofDoc: null,
    agreeTerms: false,
  });

  // Pre-fill user information if authenticated
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        email: prev.email || currentUser.email || '',
      }));
    }
  }, [currentUser]);

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

  const handleRealFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingDoc((prev) => ({ ...prev, [field]: true }));
    setUploadErrors((prev) => ({ ...prev, [field]: null }));

    try {
      const res = await uploadsAPI.uploadImage(file, {
        folder: 'carzodrive/drivers',
        prefix: field.replace('Doc', ''),
      });

      if (res?.data?.url) {
        setFormData((prev) => ({
          ...prev,
          [field]: res.data.url,
        }));
      }
    } catch (err) {
      console.error(`Document upload error for ${field}:`, err);
      setUploadErrors((prev) => ({
        ...prev,
        [field]: err.message || 'Upload failed. Please check format (PDF/JPG/PNG max 10MB)',
      }));
    } finally {
      setUploadingDoc((prev) => ({ ...prev, [field]: false }));
    }
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await driversAPI.register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        city: formData.city,
        drivingExperience: formData.drivingExperience,
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        vehicleType: formData.vehicleType,
        languages: formData.languages,
        drivingLicenseDoc: formData.drivingLicenseDoc,
        idProofDoc: formData.idProofDoc,
        profilePhotoDoc: formData.profilePhotoDoc,
        addressProofDoc: formData.addressProofDoc,
        agreeTerms: formData.agreeTerms,
      });

      setSubmittedDriver(res?.data || null);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Driver submission failed:', err);
      setSubmitError(err.message || 'Failed to submit driver registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: '01', title: 'Personal', label: 'Personal Details' },
    { number: '02', title: 'Driving', label: 'Driving Details' },
    { number: '03', title: 'Documents', label: 'Upload Documents' },
    { number: '04', title: 'Review', label: 'Review & Submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <DriverStepIndicator
        currentStep={currentStep}
        isSubmitted={isSubmitted}
        steps={steps}
      />

      <div className="p-7 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        {isSubmitted ? (
          <DriverRegSuccess
            formData={formData}
            submittedDriver={submittedDriver}
            onReset={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }}
          />
        ) : (
          <div>
            {currentStep === 1 && (
              <DriverStepPersonal
                formData={formData}
                onInputChange={handleInputChange}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <DriverStepDriving
                formData={formData}
                availableLanguages={availableLanguages}
                onInputChange={handleInputChange}
                onToggleLanguage={toggleLanguage}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}

            {currentStep === 3 && (
              <DriverStepDocuments
                formData={formData}
                uploadingDoc={uploadingDoc}
                uploadErrors={uploadErrors}
                licenseInputRef={licenseInputRef}
                idProofInputRef={idProofInputRef}
                profilePhotoInputRef={profilePhotoInputRef}
                addressProofInputRef={addressProofInputRef}
                onFileUpload={handleRealFileUpload}
                onRemoveDoc={(field) => handleInputChange(field, null)}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}

            {currentStep === 4 && (
              <DriverStepReview
                formData={formData}
                submitError={submitError}
                isSubmitting={isSubmitting}
                isAuthenticated={isAuthenticated}
                openAuthModal={openAuthModal}
                onGoToStep={setCurrentStep}
                onInputChange={handleInputChange}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
