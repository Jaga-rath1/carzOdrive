import React from 'react';
import { Container } from '../../components/common/Container';
import { RentBikeHero } from '../../components/rent-bike/RentBikeHero';
import { RentBikeHowItWorks } from '../../components/rent-bike/RentBikeHowItWorks';
import { RentBikeCalculator } from '../../components/rent-bike/RentBikeCalculator';
import { RentBikeForm } from '../../components/rent-bike/RentBikeForm';
import { RentBikeBenefits } from '../../components/rent-bike/RentBikeBenefits';

export const RentYourBikePage = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <RentBikeHero />

      {/* 2. HOW IT WORKS */}
      <RentBikeHowItWorks />

      {/* 3. CALCULATOR & REGISTRATION FORM */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-5">
              <RentBikeCalculator />
            </div>
            <div className="lg:col-span-7">
              <RentBikeForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. BENEFITS */}
      <RentBikeBenefits />
    </div>
  );
};
