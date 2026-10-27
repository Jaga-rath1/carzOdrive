import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Container } from '../common/Container';

export const ContactFAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'What documents are required to rent a self-drive car or bike?',
      a: 'You need an original and valid driving license (held for at least 1 year for cars), government photo ID (Aadhaar Card or Passport), and a digital selfie verification during pickup. International tourists require an International Driving Permit (IDP) and passport.',
    },
    {
      q: 'How quickly is the security deposit refunded?',
      a: 'Security deposits are released immediately upon vehicle return and automated digital handover inspection. Bank refunds typically reflect within 2 to 24 hours depending on your payment provider.',
    },
    {
      q: 'Can I take a self-drive vehicle across state borders?',
      a: 'Yes, all CARZODRIVE vehicles come with all-India permits. Inter-state toll and state entry taxes can be paid directly at toll plazas or fast-tagged through our automated concierge system.',
    },
    {
      q: 'What is your cancellation and rescheduling policy?',
      a: 'Free cancellation up to 6 hours before scheduled trip start time. Cancellations within 6 hours incur a nominal processing fee equivalent to 20% of the first day rental.',
    },
    {
      q: 'Is fuel included in the self-drive rental price?',
      a: 'Our self-drive rentals follow a transparent "Same-to-Same" fuel policy. You receive the vehicle with a specific fuel level and return it with the same level. No hidden fuel markup fees.',
    },
    {
      q: 'How does the Driver / Driver-Only service work?',
      a: 'You can hire a verified, protocol-trained driver for your own car or book a car with a driver. Our drivers arrive 15 minutes before the requested time in formal attire.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/80 border-t border-slate-200/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Everything you need to know about our luxury mobility standards, booking, and handoff.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
