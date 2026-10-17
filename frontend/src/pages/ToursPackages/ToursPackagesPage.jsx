import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ToursHero } from '../../components/packages/ToursHero';
import { ToursExperience } from '../../components/packages/ToursExperience';
import { ToursGrid } from '../../components/packages/ToursGrid';

export const ToursPackagesPage = () => {
  const { handleOpenQuickBook } = useOutletContext() || {};

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <ToursHero />

      {/* 2. TRIP GUARANTEES & EXPERIENCE HIGHLIGHTS */}
      <ToursExperience />

      {/* 3. PACKAGES FILTER & LISTING GRID WITH DETAIL MODAL */}
      <ToursGrid onOpenQuickBook={handleOpenQuickBook} />
    </div>
  );
};
