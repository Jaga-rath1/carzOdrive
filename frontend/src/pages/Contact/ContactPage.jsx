import React from 'react';
import { Container } from '../../components/common/Container';
import { ContactHero } from '../../components/contact/ContactHero';
import { ContactCards } from '../../components/contact/ContactCards';
import { ContactForm } from '../../components/contact/ContactForm';
import { ContactHubs } from '../../components/contact/ContactHubs';
import { ContactFAQ } from '../../components/contact/ContactFAQ';

export const ContactPage = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-white text-slate-900 overflow-x-hidden">
      {/* 1. HERO */}
      <ContactHero />

      {/* 2. CHANNELS / SUMMARY CARDS */}
      <ContactCards />

      {/* 3. INQUIRY FORM & REGIONAL HUBS */}
      <section className="py-6 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <ContactHubs />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. FAQ ACCORDION */}
      <ContactFAQ />
    </div>
  );
};
