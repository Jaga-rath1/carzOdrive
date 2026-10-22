import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Compass,
  MapPin,
  IndianRupee,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { packagesAPI } from '../../services/api';
import { PackageGeneralTab, ODISHA_THEMES } from './package-modal/PackageGeneralTab';
import { PackagePricingTab } from './package-modal/PackagePricingTab';
import { PackageItineraryTab } from './package-modal/PackageItineraryTab';
import { PackageMediaTab } from './package-modal/PackageMediaTab';
import { PackageHighlightsTab } from './package-modal/PackageHighlightsTab';

const DEFAULT_PACKAGE_STATE = {
  title: '',
  name: '',
  destination: '',
  category: 'Spiritual & Temples',
  odishaTheme: 'Spiritual & Temples',
  badge: '',
  tagline: '',
  featuredVehicle: '',
  pickupLocation: '',
  dropLocation: '',

  durationDays: 1,
  durationNights: 0,
  duration: '1 Day',

  adultPrice: '',
  childPrice: '',
  infantPrice: 0,
  priceNumeric: 0,
  startingPrice: '',

  minPax: 1,
  maxPax: 10,

  image: '',
  images: [],

  inclusions: [],
  exclusions: [],
  itinerary: [],
  highlights: [],

  description: '',
};

export const AddPackageModal = ({ isOpen, packageToEdit, onClose, onPackageSaved }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(DEFAULT_PACKAGE_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (packageToEdit) {
      const days = packageToEdit.duration?.days || 1;
      const nights = packageToEdit.duration?.nights || 0;
      const durationStr = typeof packageToEdit.duration === 'string'
        ? packageToEdit.duration
        : `${days} Days / ${nights} Nights`;

      const adultP = packageToEdit.pricing?.adultPrice || packageToEdit.priceNumeric || '';
      const childP = packageToEdit.pricing?.childPrice || '';
      const infantP = packageToEdit.pricing?.infantPrice || 0;

      setFormData({
        ...DEFAULT_PACKAGE_STATE,
        ...packageToEdit,
        title: packageToEdit.name || packageToEdit.title || '',
        name: packageToEdit.name || packageToEdit.title || '',
        destination: packageToEdit.destination || '',
        category: packageToEdit.odishaTheme || packageToEdit.category || 'Spiritual & Temples',
        odishaTheme: packageToEdit.odishaTheme || packageToEdit.category || 'Spiritual & Temples',
        badge: packageToEdit.badge || '',
        tagline: packageToEdit.tagline || '',
        featuredVehicle: packageToEdit.featuredVehicle || '',
        pickupLocation: packageToEdit.pickupLocation || '',
        dropLocation: packageToEdit.dropLocation || '',

        durationDays: days,
        durationNights: nights,
        duration: durationStr,

        adultPrice: adultP,
        childPrice: childP,
        infantPrice: infantP,
        priceNumeric: Number(adultP) || 0,
        startingPrice: adultP ? `₹${Number(adultP).toLocaleString('en-IN')}` : '',

        minPax: packageToEdit.minPax || 1,
        maxPax: packageToEdit.maxPax || 10,

        image: packageToEdit.image || (packageToEdit.images && packageToEdit.images[0]) || '',
        images: packageToEdit.images?.length ? packageToEdit.images : (packageToEdit.image ? [packageToEdit.image] : []),

        inclusions: packageToEdit.inclusions?.length ? packageToEdit.inclusions : [],
        exclusions: packageToEdit.exclusions?.length ? packageToEdit.exclusions : [],
        itinerary: packageToEdit.itinerary?.length ? packageToEdit.itinerary : [],
        highlights: packageToEdit.highlights?.length ? packageToEdit.highlights : [],
        description: packageToEdit.description || '',
      });
    } else {
      setFormData(DEFAULT_PACKAGE_STATE);
    }
    setActiveTab('general');
    setError(null);
  }, [packageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please provide a package title.');
      setActiveTab('general');
      return;
    }

    if (!formData.destination.trim()) {
      setError('Please specify the destination or circuit.');
      setActiveTab('general');
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = (formData.title || formData.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const adultPrice = Number(formData.adultPrice || 4999);
      const childPrice = Number(formData.childPrice || Math.round(adultPrice * 0.5));
      const infantPrice = Number(formData.infantPrice || 0);

      const days = Number(formData.durationDays || 2);
      const nights = Number(formData.durationNights || (days > 1 ? days - 1 : 0));
      const durationStr = `${days} Days / ${nights} Nights`;

      const primaryImg = formData.image || (formData.images && formData.images[0]);
      const galleryList = (formData.images && formData.images.length > 0)
        ? formData.images
        : [primaryImg];

      const payload = {
        name: formData.title.trim(),
        title: formData.title.trim(),
        slug: packageToEdit?.slug || slug,
        destination: formData.destination.trim(),
        category: formData.category || 'Spiritual & Temples',
        odishaTheme: formData.category || 'Spiritual & Temples',
        badge: formData.badge || 'Odisha Special',
        tagline: formData.tagline || '',
        featuredVehicle: formData.featuredVehicle || 'Toyota Innova Crysta / Luxury Chauffeur',
        pickupLocation: formData.pickupLocation || 'Bhubaneswar Airport / Railway Station',
        dropLocation: formData.dropLocation || 'Bhubaneswar Hub / Airport',

        duration: durationStr,
        durationStr: durationStr,

        startingPrice: `₹${adultPrice.toLocaleString('en-IN')}`,
        priceNumeric: adultPrice,
        pricing: {
          adultPrice,
          childPrice,
          infantPrice,
        },

        minPax: Number(formData.minPax || 1),
        maxPax: Number(formData.maxPax || 12),

        image: primaryImg,
        images: galleryList,
        gallery: galleryList,

        inclusions: formData.inclusions || [],
        exclusions: formData.exclusions || [],
        itinerary: formData.itinerary || [],
        highlights: formData.highlights || [],
        description: formData.description || '',

        status: 'APPROVED',
        isPublished: true,
        isAvailable: true,
      };

      let res;
      if (packageToEdit && packageToEdit._id) {
        res = await packagesAPI.update(packageToEdit._id, payload);
      } else {
        res = await packagesAPI.create(payload);
      }

      const savedPackage = res?.data || payload;
      onPackageSaved?.(savedPackage);
      onClose();
    } catch (err) {
      console.error('Save package error:', err);
      setError(err.message || 'Failed to save tour package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Circuit & Details', icon: Compass },
    { id: 'pricing', label: 'Tariff & Inclusions', icon: IndianRupee },
    { id: 'itinerary', label: 'Day-Wise Itinerary', icon: Calendar },
    { id: 'media', label: 'Cloudinary Photos', icon: ImageIcon },
    { id: 'highlights', label: 'Narrative & Highlights', icon: Sparkles },
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {packageToEdit ? `Edit Odisha Tour: ${packageToEdit.name || packageToEdit.title}` : 'Add New Odisha Tour Package'}
              </h2>
              <p className="text-xs text-zinc-400">
                Configure destination circuits, day-wise itineraries, Cloudinary photos & pricing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-zinc-200 bg-zinc-50 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-t border-l border-r ${
                  isActive
                    ? 'bg-white text-blue-600 border-zinc-200 border-b-transparent shadow-xs font-black'
                    : 'text-zinc-600 hover:text-zinc-900 border-transparent hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            {activeTab === 'general' && (
              <PackageGeneralTab
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {activeTab === 'pricing' && (
              <PackagePricingTab
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {activeTab === 'itinerary' && (
              <PackageItineraryTab
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {activeTab === 'media' && (
              <PackageMediaTab
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {activeTab === 'highlights' && (
              <PackageHighlightsTab
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-300 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Package...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{packageToEdit ? 'Update Tour Package' : 'Publish Tour Package'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
};
