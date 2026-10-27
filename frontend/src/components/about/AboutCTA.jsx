import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

export const AboutCTA = () => {
  return (
    <section className="py-16 sm:py-24 bg-white text-center">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Ready to Experience CARZODRIVE?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            Reserve your dream car, superbike, or verified driver today with instant digital confirmation.
          </p>
          <div className="pt-2">
            <Link
              to="/car-self-ride"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_30px_rgba(37,99,235,0.65)] border border-blue-400/30 transition-all active:scale-95 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
