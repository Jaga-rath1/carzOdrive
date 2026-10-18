import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { packagesAPI } from '../../services/api';
import { TourDetailHero } from '../../components/tour-detail/TourDetailHero';
import { TourDetailContent } from '../../components/tour-detail/TourDetailContent';
import { TourDetailBookingBox } from '../../components/tour-detail/TourDetailBookingBox';

export const TourDetailPage = () => {
  const { id } = useParams();
  const { handleOpenQuickBook } = useOutletContext() || {};

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadTour() {
      try {
        const res = await packagesAPI.getByIdOrSlug(id);
        if (res?.data && isMounted) {
          const raw = res.data;
          const coverImage =
            (raw.images && raw.images[0]) ||
            'https://plus.unsplash.com/premium_photo-1697729536647-4e23a32dd324?q=80&w=1170&auto=format&fit=crop';
          const price = raw.pricing?.adultPrice || 5499;

          const normalized = {
            id: raw.slug || raw._id || raw.id,
            _id: raw._id || raw.id,
            packageId: raw._id || raw.id,
            title: raw.name,
            name: raw.name,
            destination: raw.destination || 'Odisha Heritage & Coast',
            duration:
              typeof raw.duration === 'string'
                ? raw.duration
                : `${raw.duration?.days || 2} Days / ${raw.duration?.nights || 1} Nights`,
            startingPrice: `₹${price.toLocaleString('en-IN')}`,
            priceNumeric: price,
            category: raw.odishaTheme || raw.category || 'Spiritual & Temples',
            odishaTheme: raw.odishaTheme || raw.category || 'Spiritual & Temples',
            badge: raw.badge || 'Odisha Special',
            featuredVehicle: raw.featuredVehicle || 'Toyota Innova Crysta / Luxury Chauffeur',
            image: coverImage,
            images: raw.images?.length ? raw.images : [coverImage],
            description: raw.description,
            highlights: raw.highlights?.length
              ? raw.highlights
              : [
                  'Dedicated AC Executive Sedan & verified Odisha route chauffeur',
                  'Flexible pickup from Bhubaneswar Airport or Railway Station',
                  'Pre-arranged monument entry passes & priority temple assistance',
                  'Authentic regional cuisine lunch and refreshment stops',
                ],
            inclusions: raw.inclusions?.length
              ? raw.inclusions
              : ['Luxury AC Vehicle', 'Driver Allowance & Fuel', 'Hotel Accommodation & Breakfast', 'Tolls & Parking'],
            itinerary: raw.itinerary?.length
              ? raw.itinerary.map((step, idx) => ({
                  day: step.day || `Day ${idx + 1}`,
                  title: step.title || `Day ${idx + 1} Itinerary`,
                  desc: step.description || step.desc || raw.description,
                }))
              : [
                  {
                    day: 'Day 1',
                    title: 'Scenic Arrival & Local Heritage Circuit',
                    desc: 'Meet your private chauffeur at the airport or station. Check-in to accommodation and begin guided tour.',
                  },
                  {
                    day: 'Day 2',
                    title: 'Coastal Exploration & Artisan Villages',
                    desc: 'Morning temple visit followed by artisanal craft villages and scenic return transfer.',
                  },
                ],
            rawTour: raw,
          };

          setTour(normalized);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('API lookup error for tour:', err);
      }

      if (isMounted) {
        setTour(null);
        setLoading(false);
      }
    }

    loadTour();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading tour package from database...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-[60vh] text-center">
        <Container className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Tour Package Not Found</h2>
          <p className="text-sm text-slate-500">The package you are looking for is not listed in our database.</p>
          <Link
            to="/tours-packages"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Curated Expeditions</span>
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 min-h-screen">
      <Container className="space-y-10">
        {/* 1. TOUR HERO HEADER */}
        <TourDetailHero tour={tour} />

        {/* 2. TWO-COLUMN TOUR OVERVIEW & ITINERARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Cover, Highlights, Itinerary, Inclusions */}
          <div className="lg:col-span-7 xl:col-span-8">
            <TourDetailContent tour={tour} />
          </div>

          {/* RIGHT: Sticky Booking & WhatsApp Box */}
          <div className="lg:col-span-5 xl:col-span-4">
            <TourDetailBookingBox
              tour={tour}
              onOpenQuickBook={handleOpenQuickBook}
            />
          </div>
        </div>

        {/* 3. BACK TO ALL PACKAGES */}
        <div className="pt-8 border-t border-slate-200">
          <Link
            to="/tours-packages"
            className="inline-flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Curated Expeditions</span>
          </Link>
        </div>
      </Container>
    </div>
  );
};
