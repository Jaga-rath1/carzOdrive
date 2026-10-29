import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X,
  Bike,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Gauge,
  Image as ImageIcon,
  Loader2,
  FileText
} from 'lucide-react';
import { bikesAPI, uploadsAPI } from '../../services/api';
import { DEFAULT_BIKE_IMAGE } from '../../utils/documentUtils';
import { BikeGeneralTab } from './bike-modal/BikeGeneralTab';
import { BikePricingTab } from './bike-modal/BikePricingTab';
import { BikeSpecsTab } from './bike-modal/BikeSpecsTab';
import { BikeFeaturesTab } from './bike-modal/BikeFeaturesTab';
import { BikeMediaTab } from './bike-modal/BikeMediaTab';
import { BikeHostTab } from './bike-modal/BikeHostTab';

const PRESET_BIKE_IMAGES = [];

const INITIAL_BIKE_STATE = {
  // General & Identity
  name: '',
  brand: '',
  model: '',
  vehicleNumber: '',
  buyingYear: new Date().getFullYear(),
  color: '',
  category: 'commuter',
  bikeType: 'COMMUTER',
  badge: '',
  tagline: '',

  // Pricing & Availability
  pricePerDay: '',
  pricePerHour: '',
  depositNumeric: '',
  extraKmCharge: 4,
  quantity: 1,
  availableCount: 1,
  isAvailable: true,
  isFeatured: false,

  // Technical Specifications
  engineCC: '',
  engineCapacity: '',
  power: '',
  torque: '',
  mileage: '',
  topSpeed: '',
  dryWeight: '',
  transmission: 'Manual',
  fuelType: 'Petrol',
  brakes: '',

  // Features, Gear & Rules
  features: '',
  gearIncluded: '',
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

export const AddBikeModal = ({ isOpen, onClose, onBikeAdded, bikeToEdit = null }) => {
  const isEditMode = Boolean(bikeToEdit && (bikeToEdit._id || bikeToEdit.id));
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(INITIAL_BIKE_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingRc, setUploadingRc] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const primaryFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const rcFileInputRef = useRef(null);

  useEffect(() => {
    if (bikeToEdit) {
      const b = bikeToEdit;
      const primaryImg = (b.images && b.images[0]) || b.image || DEFAULT_BIKE_IMAGE;
      const galleryImgs = Array.isArray(b.images) && b.images.length > 0
        ? b.images
        : Array.isArray(b.secondaryImages) && b.secondaryImages.length > 0
          ? b.secondaryImages
          : [primaryImg];

      setFormData({
        name: b.name || '',
        brand: b.brand || b.make || '',
        model: b.model || b.name || '',
        vehicleNumber: b.registrationNumber || b.rcNumber || '',
        buyingYear: b.buyingYear || b.year || 2024,
        color: b.color || b.specs?.color || 'Stealth Black',
        category: (b.category || 'cruiser').toLowerCase(),
        bikeType: (b.bikeType || b.category || 'CRUISER').toUpperCase(),
        badge: b.badge || 'Verified Two-Wheeler',
        tagline: b.tagline || '',

        pricePerDay: b.pricePerDay || b.priceNumeric || b.pricing?.daily || b.pricing?.dailyRate || '',
        pricePerHour: b.pricePerHour || b.pricing?.hourly || '',
        depositNumeric: b.depositNumeric || b.pricing?.securityDeposit || 1500,
        extraKmCharge: b.extraKmCharge || b.pricing?.extraKmCharge || 4,
        availableCount: b.availableCount ?? (b.isAvailable !== false ? 1 : 0),
        isAvailable: b.isAvailable !== false,
        isFeatured: Boolean(b.isFeatured),

        engineCC: b.engineCC || (b.specs?.engine ? parseInt(b.specs.engine, 10) : 350) || 350,
        engineCapacity: b.engineCapacity || b.specs?.engine || `${b.engineCC || 350} cc`,
        power: b.power || b.specs?.power || '20.2 HP @ 6100 rpm',
        torque: b.torque || b.specs?.torque || '27 Nm @ 4000 rpm',
        mileage: b.mileage || b.specs?.mileage || '38-42 km/l',
        topSpeed: b.topSpeed || b.specs?.topSpeed || '120 km/h',
        dryWeight: b.dryWeight || b.specs?.dryWeight || '195 kg',
        transmission: b.transmission || b.specs?.transmission || '5-Speed Manual',
        fuelType: b.fuelType || b.specs?.fuelType || 'Petrol',
        brakes: b.brakes || b.specs?.brakes || 'Dual-Channel ABS',

        features: Array.isArray(b.features) ? b.features.join(', ') : (b.features || INITIAL_BIKE_STATE.features),
        gearIncluded: Array.isArray(b.gearIncluded) ? b.gearIncluded.join(', ') : (b.gearIncluded || INITIAL_BIKE_STATE.gearIncluded),
        inclusions: Array.isArray(b.inclusions) ? b.inclusions.join(', ') : (b.inclusions || INITIAL_BIKE_STATE.inclusions),
        rules: Array.isArray(b.rules) ? b.rules.join(', ') : (b.rules || INITIAL_BIKE_STATE.rules),

        locationCity: b.location?.city || 'Bhubaneswar',
        hubAddress: b.location?.address || 'Bhubaneswar Railway Station & Master Canteen Hub',

        image: primaryImg,
        images: galleryImgs,
        secondaryImages: galleryImgs.slice(1),

        ownerName: b.ownerName || '',
        ownerPhone: b.ownerPhone || '',
        ownerEmail: b.ownerEmail || '',
        rcDocumentUrl: b.rcDocumentUrl || '',
      });
    } else {
      setFormData(INITIAL_BIKE_STATE);
    }
    setActiveTab('general');
    setStatusMessage(null);
  }, [bikeToEdit, isOpen]);

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
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/bikes', prefix: 'bike-main' });
      if (res?.data?.url) {
        const url = res.data.url;
        setFormData((prev) => ({
          ...prev,
          image: url,
          images: prev.images.includes(url) ? prev.images : [url, ...prev.images.filter((u) => u !== prev.image)],
        }));
        setStatusMessage({ type: 'success', text: '✓ Bike cover photo uploaded to Cloudinary CDN!' });
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
      const res = await uploadsAPI.uploadImages(files, { folder: 'carzodrive/bikes/gallery', prefix: 'bike-gallery' });
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
      const res = await uploadsAPI.uploadImage(file, { folder: 'carzodrive/documents/rc-bikes', prefix: 'bike-rc' });
      if (res?.data?.url) {
        setFormData((prev) => ({ ...prev, rcDocumentUrl: res.data.url }));
        setStatusMessage({ type: 'success', text: '✓ RC Document uploaded to Cloudinary!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'RC upload failed' });
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
      setStatusMessage({ type: 'error', text: 'Please fill in bike name, brand and daily rate.' });
      return;
    }

    setIsLoading(true);

    try {
      const slug = isEditMode && bikeToEdit.slug
        ? bikeToEdit.slug
        : formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      const priceDaily = Number(formData.pricePerDay);
      const priceHourly = formData.pricePerHour ? Number(formData.pricePerHour) : Math.round(priceDaily / 10);
      const deposit = formData.depositNumeric ? Number(formData.depositNumeric) : 1500;
      const bYear = Number(formData.buyingYear || 2024);
      const vNum = formData.vehicleNumber ? formData.vehicleNumber.toUpperCase().trim() : undefined;
      const engineCcNum = Number(formData.engineCC || 350);

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
        color: formData.color || 'Stealth Black',
        category: formData.category.toLowerCase(),
        bikeType: formData.bikeType.toUpperCase(),
        vehicleType: 'bike',
        engineCC: engineCcNum,
        engineCapacity: `${engineCcNum} cc`,

        pricePerDay: priceDaily,
        pricePerHour: priceHourly,
        priceNumeric: priceDaily,
        depositNumeric: deposit,
        deposit: `₹${deposit.toLocaleString('en-IN')}`,
        securityDeposit: deposit,
        extraKmCharge: Number(formData.extraKmCharge || 4),

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
        badge: formData.badge || 'Verified Two-Wheeler',
        tagline: formData.tagline || `Popular ${formData.brand} ${formData.name} bike for rent in Bhubaneswar`,

        image: formData.image,
        images: galleryList,
        secondaryImages: secondaryList,
        gallery: galleryList,

        power: formData.power,
        torque: formData.torque,
        mileage: formData.mileage,
        topSpeed: formData.topSpeed,
        dryWeight: formData.dryWeight,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        brakes: formData.brakes,

        specs: {
          power: formData.power,
          engine: `${engineCcNum} cc Performance Motor`,
          torque: formData.torque,
          topSpeed: formData.topSpeed,
          mileage: formData.mileage,
          dryWeight: formData.dryWeight,
          transmission: formData.transmission,
          brakes: formData.brakes,
          fuelType: formData.fuelType,
          color: formData.color,
        },

        location: {
          city: formData.locationCity,
          state: 'Odisha',
          address: formData.hubAddress,
        },
        pricing: {
          daily: priceDaily,
          hourly: priceHourly,
          dailyRate: priceDaily,
          weekly: priceDaily * 6,
          monthly: priceDaily * 20,
          securityDeposit: deposit,
          extraKmCharge: Number(formData.extraKmCharge || 4),
        },

        features: typeof formData.features === 'string'
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.features,
        gearIncluded: typeof formData.gearIncluded === 'string'
          ? formData.gearIncluded.split(',').map((f) => f.trim()).filter(Boolean)
          : formData.gearIncluded,
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
        const bikeId = bikeToEdit._id || bikeToEdit.id;
        res = await bikesAPI.update(bikeId, payload);
        setStatusMessage({ type: 'success', text: `✓ Bike "${formData.name}" updated successfully!` });
      } else {
        res = await bikesAPI.create(payload);
        setStatusMessage({ type: 'success', text: `✓ Success! "${formData.name}" added to the fleet!` });
      }

      if (onBikeAdded) onBikeAdded(res?.data || payload);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Bike submission error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save bike.' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: '1. General & Identity', icon: Bike },
    { id: 'pricing', label: '2. Pricing & Fleet Units', icon: IndianRupee },
    { id: 'specs', label: '3. Engine & Performance', icon: Gauge },
    { id: 'features', label: '4. Gear, Features & Rules', icon: Sparkles },
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
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-950 tracking-tight">
                  {isEditMode ? `Edit Bike: ${formData.name || 'Two-Wheeler'}` : 'Add New Bike to Fleet'}
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  {isEditMode ? 'Update motorcycle & scooty specs with Cloudinary CDN' : 'Publish new motorcycle or scooty to CarzoDrive catalog'}
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

          {/* Tabs */}
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

        {/* Tab Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 flex-1">
          {activeTab === 'general' && (
            <BikeGeneralTab
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
            />
          )}

          {activeTab === 'pricing' && (
            <BikePricingTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'specs' && (
            <BikeSpecsTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'features' && (
            <BikeFeaturesTab
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'media' && (
            <BikeMediaTab
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
              presetImages={PRESET_BIKE_IMAGES}
            />
          )}

          {activeTab === 'host' && (
            <BikeHostTab
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
                    <span>{isEditMode ? 'Updating Bike...' : 'Publishing Bike...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-zinc-200" />
                    <span>{isEditMode ? 'Save Bike Changes' : 'Add Bike to Fleet'}</span>
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
