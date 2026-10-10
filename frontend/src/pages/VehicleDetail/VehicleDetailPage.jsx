import React from 'react';
import { useParams, useOutletContext, Navigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { getVehicleById } from '../../data/catalog';
import { VehicleDetailHero } from '../../components/vehicle-detail/VehicleDetailHero';
import { VehicleDetailGallery } from '../../components/vehicle-detail/VehicleDetailGallery';
import { VehicleDetailSpecs } from '../../components/vehicle-detail/VehicleDetailSpecs';
import { VehicleDetailFeatures } from '../../components/vehicle-detail/VehicleDetailFeatures';
import { VehicleDetailBookingBox } from '../../components/vehicle-detail/VehicleDetailBookingBox';
import { VehicleDetailSimilar } from '../../components/vehicle-detail/VehicleDetailSimilar';

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const { handleOpenQuickBook } = useOutletContext() || {};

  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return <Navigate to="/car-self-ride" replace />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 min-h-screen">
      <Container className="space-y-10">
        {/* 1. HERO HEADER WITH BREADCRUMB, TITLE, REVIEWS & WHATSAPP ACTION */}
        <VehicleDetailHero vehicle={vehicle} />

        {/* 2. TWO-COLUMN INTERACTIVE DETAIL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Gallery, Specs, Features, Policies */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            <VehicleDetailGallery vehicle={vehicle} />
            <VehicleDetailSpecs vehicle={vehicle} />
            <VehicleDetailFeatures vehicle={vehicle} />
          </div>

          {/* RIGHT COLUMN: Sticky Pricing Box & Actions */}
          <div className="lg:col-span-5 xl:col-span-4">
            <VehicleDetailBookingBox
              vehicle={vehicle}
              onOpenQuickBook={handleOpenQuickBook}
            />
          </div>
        </div>

        {/* 3. SIMILAR VEHICLES SECTION */}
        <VehicleDetailSimilar
          currentVehicle={vehicle}
          onOpenQuickBook={handleOpenQuickBook}
        />
      </Container>
    </div>
  );
};
