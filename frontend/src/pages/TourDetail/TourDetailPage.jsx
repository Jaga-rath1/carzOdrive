import React from 'react';
import { useParams, useOutletContext, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '../../components/common/Container';
import { getTourById } from '../../data/catalog';
import { TourDetailHero } from '../../components/tour-detail/TourDetailHero';
import { TourDetailContent } from '../../components/tour-detail/TourDetailContent';
import { TourDetailBookingBox } from '../../components/tour-detail/TourDetailBookingBox';

export const TourDetailPage = () => {
  const { id } = useParams();
  const { handleOpenQuickBook } = useOutletContext() || {};

  const tour = getTourById(id);

  if (!tour) {
    return <Navigate to="/tours-packages" replace />;
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
