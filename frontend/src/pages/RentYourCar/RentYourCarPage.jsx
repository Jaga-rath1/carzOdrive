import React from 'react';
import { Container } from '../../components/common/Container';
import { RentCarHero } from '../../components/rent-car/RentCarHero';
import { RentCarHowItWorks } from '../../components/rent-car/RentCarHowItWorks';
import { RentCarCalculator } from '../../components/rent-car/RentCarCalculator';
import { RentCarForm } from '../../components/rent-car/RentCarForm';
import { RentCarBenefits } from '../../components/rent-car/RentCarBenefits';

export const RentYourCarPage = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <RentCarHero />

      {/* 2. HOW IT WORKS */}
      <RentCarHowItWorks />

      {/* 3. CALCULATOR & VEHICLE REGISTRATION FORM */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-5">
              <RentCarCalculator />
            </div>
            <div className="lg:col-span-7">
              <RentCarForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. BENEFITS */}
      <RentCarBenefits />
    </div>
  );
};
