import React from 'react';
import { Container } from '../../components/common/Container';
import { DriverRegHero } from '../../components/driver-registration/DriverRegHero';
import { DriverRegStats } from '../../components/driver-registration/DriverRegStats';
import { DriverRegForm } from '../../components/driver-registration/DriverRegForm';

export const DriverRegistrationPage = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <DriverRegHero />

      {/* 2. STATS */}
      <DriverRegStats />

      {/* 3. MULTI-STEP REGISTRATION WIZARD */}
      <section className="py-6 sm:py-10">
        <Container>
          <DriverRegForm />
        </Container>
      </section>
    </div>
  );
};
