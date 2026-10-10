import React from 'react';
import { AboutHero } from '../../components/about/AboutHero';
import { AboutStats } from '../../components/about/AboutStats';
import { AboutStory } from '../../components/about/AboutStory';
import { AboutMissionVision } from '../../components/about/AboutMissionVision';
import { AboutWhyChoose } from '../../components/about/AboutWhyChoose';
import { AboutTimeline } from '../../components/about/AboutTimeline';
import { AboutCTA } from '../../components/about/AboutCTA';

export const AboutPage = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <AboutHero />

      {/* 2. STATS */}
      <AboutStats />

      {/* 3. STORY */}
      <AboutStory />

      {/* 4. MISSION & VISION */}
      <AboutMissionVision />

      {/* 5. WHY CHOOSE */}
      <AboutWhyChoose />

      {/* 6. TIMELINE */}
      <AboutTimeline />

      {/* 7. CTA */}
      <AboutCTA />
    </div>
  );
};
