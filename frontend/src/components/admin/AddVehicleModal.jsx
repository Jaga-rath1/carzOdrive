import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X,
  Car,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Gauge,
  Image as ImageIcon,
  Loader2,
  FileText
} from 'lucide-react';
import { vehiclesAPI, uploadsAPI } from '../../services/api';
import { VehicleGeneralTab } from './vehicle-modal/VehicleGeneralTab';
import { VehiclePricingTab } from './vehicle-modal/VehiclePricingTab';
import { VehicleSpecsTab } from './vehicle-modal/VehicleSpecsTab';
import { VehicleFeaturesTab } from './vehicle-modal/VehicleFeaturesTab';
import { VehicleMediaTab } from './vehicle-modal/VehicleMediaTab';
import { VehicleHostTab } from './vehicle-modal/VehicleHostTab';

const PRESET_IMAGES = [];

const INITIAL_FORM_STATE = {
  // General & Identity
  name: '',
  brand: '',
  model: '',
  vehicleNumber: '',
  buyingYear: new Date().getFullYear(),
  color: '',
  category: 'suv',
  vehicleType: 'SUV',
  badge: '',
  tagline: '',

  // Pricing & Availability
  pricePerDay: '',
  pricePerHour: '',
  depositNumeric: '',
  extraKmCharge: 12,
  quantity: 1,
  availableCount: 1,
  isAvailable: true,
  isFeatured: false,
  serviceTypes: ['SELF_DRIVE', 'WITH_DRIVER'],

  // Technical Specifications
  seats: 5,
  fuelType: 'DIESEL',
  transmission: 'MANUAL',
  engineCapacity: '',
  power: '',
  mileage: '',
  topSpeed: '',
  acceleration: '',
  bootSpace: '',
  luggage: '',
  airbags: '',
  groundClearance: '',
  drivetrain: '',

  // Features, Inclusions & Rules
  features: '',
  inclusions: '',
  rules: '',

  // Location & Hub
  locationCity: 'Bhubaneswar',
  hubAddress: '',

  // Media & Cloudinary
  image: '',
  images: [],
  secondaryImages: [],

  // Host / Vendor info
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  rcDocumentUrl: '',
};

export const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded, vehicleToEdit = null }) => {
  const isEditMode = Boolean(vehicleToEdit && (vehicleToEdit._id || vehicleToEdit.id));
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingRc, setUploadingRc] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const primaryFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const rcFileInputRef = useRef(null);

  useEffect(() => {
    if (vehicleToEdit) {
      const v = vehicleToEdit;
      const primaryImg = (v.images && v.images[0]) || v.image || '/images/vehicles/swift-2026-grey.jpg';
      const galleryImgs = Array.isArray(v.images) && v.images.length > 0
        ? v.images
        : Array.isArray(v.secondaryImages) && v.secondaryImages.length > 0
        ? v.secondaryImages
        : [primaryImg];

      setFormData({
        name: v.name || '',
        brand: v.brand || v.make || '',
        model: v.model || v.name || '',
        vehicleNumber: v.registrationNumber || v.rcNumber || '',
        buyingYear: v.buyingYear || v.year || 2024,
        color: v.color || v.specs?.color || 'Pearl White',
        category: (v.category || 'suv').toLowerCase(),
        vehicleType: v.vehicleType || 'SUV',
        badge: v.badge || 'Verified Fleet',
        tagline: v.tagline || '',

        pricePerDay: v.pricePerDay || v.priceNumeric || v.pricing?.dailyRate || '',
        pricePerHour: v.pricePerHour || v.pricing?.hourlyRate || '',
        depositNumeric: v.depositNumeric || v.securityDeposit || v.pricing?.securityDeposit || '',
        extraKmCharge: v.extraKmCharge || v.pricing?.extraKmCharge || 12,
        quantity: v.quantity ?? v.availableCount ?? (v.isAvailable !== false ? 1 : 0),
        availableCount: v.quantity ?? v.availableCount ?? (v.isAvailable !== false ? 1 : 0),
        isAvailable: v.isAvailable !== false && (v.quantity ?? v.availableCount ?? 1) > 0,
        isFeatured: Boolean(v.isFeatured),
        serviceTypes: v.serviceTypes || ['SELF_DRIVE', 'WITH_DRIVER'],

        seats: v.specs?.seats || v.seats || 5,
        fuelType: (v.fuelType || v.specs?.fuelType || 'DIESEL').toUpperCase(),
        transmission: (v.transmission || v.specs?.transmission || 'AUTOMATIC').toUpperCase(),
        engineCapacity: v.engineCapacity || v.specs?.engine || '1997 cc',
        power: v.power || v.specs?.power || '150 HP',
        mileage: v.mileage || v.specs?.mileage || '16.5 km/l',
        topSpeed: v.topSpeed || v.specs?.topSpeed || '175 km/h',
        acceleration: v.acceleration || v.specs?.acceleration || '10.2s',
        bootSpace: v.bootSpace || v.specs?.bootSpace || '380 Litres',
        luggage: v.luggage || v.specs?.luggage || '3 Large Bags',
        airbags: v.airbags || v.specs?.airbags || '6 Airbags (Dual Front + Curtain)',
        groundClearance: v.groundClearance || v.specs?.groundClearance || '226 mm',
        drivetrain: v.drivetrain || v.specs?.drivetrain || '4x4',

        features: Array.isArray(v.features) ? v.features.join(', ') : (v.features || INITIAL_FORM_STATE.features),
        inclusions: Array.isArray(v.inclusions) ? v.inclusions.join(', ') : (v.inclusions || INITIAL_FORM_STATE.inclusions),
        rules: Array.isArray(v.rules) ? v.rules.join(', ') : (v.rules || INITIAL_FORM_STATE.rules),

        locationCity: v.location?.city || 'Bhubaneswar',
        hubAddress: v.location?.address || 'Bhubaneswar Airport Hub & Master Canteen Hub',

        image: primaryImg,
        images: galleryImgs,
        secondaryImages: galleryImgs.slice(1),

        ownerName: v.ownerName || '',
        ownerPhone: v.ownerPhone || '',
        ownerEmail: v.ownerEmail || '',
        rcDocumentUrl: v.rcDocumentUrl || '',
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setActiveTab('general');
    setStatusMessage(null);
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePrimaryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage(null);
    try {
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/cars', prefix: 'car-main' });
      if (res?.data?.url) {
        const url = res.data.url;
        setFormData((prev) => ({
          ...prev,
          image: url,
          images: prev.images.includes(url) ? prev.images : [url, ...prev.images.filter((u) => u !== prev.image)],
        }));
        setStatusMessage({ type: 'success', text: '✓ Vehicle cover photo uploaded to Cloudinary CDN!' });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Cloudinary upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setStatusMessage(null);
    try {
      const res = await uploadsAPI.uploadImages(files, { folder: 'carzodrive/cars/gallery', prefix: 'car-gallery' });
      const newUrls = res?.data?.urls || res?.data?.files?.map((f) => f.url) || [];
      if (newUrls.length > 0) {
        setFormData((prev) => {
          const combined = Array.from(new Set([...prev.images, ...newUrls]));
          return {
            ...prev,
            images: combined,
            secondaryImages: combined.filter((u) => u !== prev.image),
          };
        });
        setStatusMessage({ type: 'success', text: `✓ ${newUrls.length} gallery image(s) uploaded to Cloudinary CDN!` });
      }
    } catch (err) {
      console.error('Gallery upload failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Gallery upload failed' });
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRcUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage(null);
    setUploadingRc(true);
    try {
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/documents/rc', prefix: 'rc-doc' });
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, rcDocumentUrl: res.data.url }));
        setStatusMessage({ type: 'success', text: '✓ RC Document uploaded to Cloudinary!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'RC Document upload failed' });
    } finally {
      setUploadingRc(false);
    }
  };

  const removeGalleryImage = (urlToRemove) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((u) => u !== urlToRemove);
      const newPrimary = prev.image === urlToRemove ? (updatedImages[0] || '') : prev.image;
      return {
        ...prev,
        image: newPrimary,
        images: updatedImages,
        secondaryImages: updatedImages.filter((u) => u !== newPrimary),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name || !formData.brand || !formData.pricePerDay) {
      setStatusMessage({ type: 'error', text: 'Please fill in vehicle name, brand and daily rate.' });
      return;
    }

    setIsLoading(true);

    try {
      const slug = isEditMode && vehicleToEdit.slug
        ? vehicleToEdit.slug
        : formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      const priceDaily = Number(formData.pricePerDay);
      const priceHourly = formData.pricePerHour ? Number(formData.pricePerHour) : Math.round(priceDaily / 12);
      const deposit = formData.depositNumeric ? Number(formData.depositNumeric) : 5000;
      const bYear = Number(formData.buyingYear || 2024);
      const vNum = formData.vehicleNumber ? formData.vehicleNumber.toUpperCase().trim() : undefined;

      const galleryList = formData.images.length > 0 ? formData.images : [formData.image];
      const secondaryList = galleryList.filter((img) => img !== formData.image);

      const payload = {
        name: formData.name,
        slug,
        brand: formData.brand,
        make: formData.brand,
        model: formData.model || formData.name,
        registrationNumber: vNum,
        rcNumber: vNum,
        buyingYear: bYear,
        year: bYear,
        color: formData.color || 'Pearl White',
        category: formData.category.toLowerCase(),
        type: `${formData.category.toUpperCase()} Rental`,
        vehicleType: formData.category.toUpperCase(),
        seats: Number(formData.seats),
        fuelType: formData.fuelType,
        transmission: formData.transmission,

        pricePerDay: priceDaily,
        pricePerHour: priceHourly,
        priceNumeric: priceDaily,
        depositNumeric: deposit,
        deposit: `₹${deposit.toLocaleString('en-IN')}`,
        securityDeposit: deposit,
        extraKmCharge: Number(formData.extraKmCharge || 12),

        quantity: (() => {
          const raw = formData.quantity !== undefined && formData.quantity !== '' ? Number(formData.quantity) : Number(formData.availableCount ?? 1);
          return isNaN(raw) ? 0 : Math.max(0, raw);
        })(),
        availableCount: (() => {
          const raw = formData.quantity !== undefined && formData.quantity !== '' ? Number(formData.quantity) : Number(formData.availableCount ?? 1);
          return isNaN(raw) ? 0 : Math.max(0, raw);
        })(),
        isAvailable: (() => {
          const raw = formData.quantity !== undefined && formData.quantity !== '' ? Number(formData.quantity) : Number(formData.availableCount ?? 1);
          const stock = isNaN(raw) ? 0 : Math.max(0, raw);
          return stock > 0 && Boolean(formData.isAvailable);
        })(),
        availabilityStatus: (() => {
          const raw = formData.quantity !== undefined && formData.quantity !== '' ? Number(formData.quantity) : Number(formData.availableCount ?? 1);
          const stock = isNaN(raw) ? 0 : Math.max(0, raw);
          return (stock > 0 && Boolean(formData.isAvailable)) ? 'Available' : 'Currently Unavailable';
        })(),
        isFeatured: Boolean(formData.isFeatured),
        isPublished: true,
        status: 'APPROVED',
        badge: formData.badge || 'Verified Fleet',
        tagline: formData.tagline || `Premium verified ${formData.brand} ${formData.name} rental in Odisha`,

        image: formData.image,
        images: galleryList,
        secondaryImages: secondaryList,
        gallery: galleryList,

        engineCapacity: formData.engineCapacity,
        power: formData.power,
        mileage: formData.mileage,
        topSpeed: formData.topSpeed,
        acceleration: formData.acceleration,
        bootSpace: formData.bootSpace,
        luggage: formData.luggage,
        airbags: formData.airbags,
        groundClearance: formData.groundClearance,
        drivetrain: formData.drivetrain,

        specs: {
          power: formData.power,
          engine: formData.engineCapacity,
          acceleration: formData.acceleration,
          topSpeed: formData.topSpeed,
          mileage: formData.mileage,
          transmission: formData.transmission,
          seats: Number(formData.seats),
          fuelType: formData.fuelType,
          drivetrain: formData.drivetrain,
          luggage: formData.luggage,
          bootSpace: formData.bootSpace,
          airbags: formData.airbags,
          groundClearance: formData.groundClearance,
          color: formData.color,
          availableUnits: Number(formData.availableCount || 1),
        },

        serviceTypes: formData.serviceTypes,
        availableFor: ['self-ride', 'with-driver'],
        location: {
          city: formData.locationCity,
          state: 'Odisha',
          address: formData.hubAddress,
        },
        pricing: {
          selfDrive: { daily: priceDaily, hourly: priceHourly, weekly: priceDaily * 6, monthly: priceDaily * 22 },
          withDriver: { daily: priceDaily + 900, hourly: priceHourly + 100, perKm: Number(formData.extraKmCharge || 12) + 3 },
          dailyRate: priceDaily,
          hourlyRate: priceHourly,
          securityDeposit: deposit,
          extraKmCharge: Number(formData.extraKmCharge || 12),
        },

        features: typeof formData.features === 'string'
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.features,
        inclusions: typeof formData.inclusions === 'string'
          ? formData.inclusions.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.inclusions,
        rules: typeof formData.rules === 'string'
          ? formData.rules.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.rules,

        ownerName: formData.ownerName || undefined,
        ownerPhone: formData.ownerPhone || undefined,
        ownerEmail: formData.ownerEmail || undefined,
        rcDocumentUrl: formData.rcDocumentUrl || undefined,
      };

      let res;
      if (isEditMode) {
        const vehicleId = vehicleToEdit._id || vehicleToEdit.id;
        res = await vehiclesAPI.update(vehicleId, payload);
        setStatusMessage({ type: 'success', text: `✓ Vehicle "${formData.name}" updated successfully!` });
      } else {
        res = await vehiclesAPI.create(payload);
        setStatusMessage({ type: 'success', text: `✓ Success! "${formData.name}" added to the fleet!` });
      }

      if (onVehicleAdded) onVehicleAdded(res?.data || payload);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Vehicle submission error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save vehicle.' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: '1. General & Identity', icon: Car },
    { id: 'pricing', label: '2. Pricing & Fleet Units', icon: IndianRupee },
    { id: 'specs', label: '3. Engine & Specifications', icon: Gauge },
    { id: 'features', label: '4. Features & Policies', icon: Sparkles },
    { id: 'media', label: '5. Cloudinary Photos', icon: ImageIcon },
    { id: 'host', label: '6. Host & Documents', icon: FileText },
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-900 max-h-[92vh] overflow-y-auto my-auto flex flex-col justify-between"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-black text-white shadow-sm">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-950 tracking-tight">
                  {isEditMode ? `Edit Car: ${formData.name || 'Fleet Vehicle'}` : 'Add New Car to Fleet'}
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  {isEditMode ? 'Update vehicle specs, rates & Cloudinary media' : 'Publish new car directly to CarzoDrive catalog with Cloudinary CDN'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Alert */}
          {statusMessage && (
            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-zinc-100 no-scrollbar mt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 flex-1">
          {activeTab === 'general' && (
            <VehicleGeneralTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'pricing' && (
            <VehiclePricingTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'specs' && (
            <VehicleSpecsTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'features' && (
            <VehicleFeaturesTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'media' && (
            <VehicleMediaTab
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              primaryFileInputRef={primaryFileInputRef}
              galleryFileInputRef={galleryFileInputRef}
              handlePrimaryUpload={handlePrimaryUpload}
              handleGalleryUpload={handleGalleryUpload}
              removeGalleryImage={removeGalleryImage}
              uploadingImage={uploadingImage}
              uploadingGallery={uploadingGallery}
              presetImages={PRESET_IMAGES}
            />
          )}

          {activeTab === 'host' && (
            <VehicleHostTab
              formData={formData}
              handleChange={handleChange}
              rcFileInputRef={rcFileInputRef}
              handleRcUpload={handleRcUpload}
              uploadingRc={uploadingRc}
            />
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloudinary CDN Live & Synced</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-sm border border-black cursor-pointer disabled:opacity-50 flex items-center gap-2 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-300" />
                    <span>{isEditMode ? 'Updating Car...' : 'Publishing Car...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-zinc-200" />
                    <span>{isEditMode ? 'Save Car Changes' : 'Add Vehicle to Fleet'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};
