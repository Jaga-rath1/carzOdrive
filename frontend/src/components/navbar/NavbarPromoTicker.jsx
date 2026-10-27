import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useDiscount } from '../../hooks/useDiscount';

export const NavbarPromoTicker = ({ onPromoClick }) => {
  const { isDiscountActive, discountPercentage, bannerText, badgeText } = useDiscount();

  // If discount is explicitly deactivated or percentage is 0, do not render
  if (!isDiscountActive || !discountPercentage || discountPercentage <= 0) {
    return null;
  }

  const effectiveBadge = badgeText || `${discountPercentage}% OFF`;
  const effectiveBanner =
    bannerText ||
    `Special Offer: Flat ${discountPercentage}% OFF on all self-drive bookings across Odisha! Automatic discount applied at checkout.`;

  const promoItems = [
    {
      badge: effectiveBadge,
      title: effectiveBanner,
      highlight: '⚡ AUTO-APPLIED AT CHECKOUT',
    },
    {
      badge: 'Zero Deposit',
      title: '₹0 Security Deposit on 100% Insured Fleet across Bhubaneswar & Odisha.',
      highlight: '🛡️ 100% INSURED',
    },
    {
      badge: 'Instant Fleet',
      title: 'Airport & Railway Station doorstep delivery within 45 minutes.',
      highlight: '🚀 45 MIN DELIVERY',
    },
  ];

  const handleTickerClick = (e) => {
    if (onPromoClick) {
      onPromoClick(e);
      return;
    }
    const el = document.getElementById('hero-booking-console');
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleTickerClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleTickerClick(e);
      }}
      className="relative w-full overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-b border-cyan-500/25 py-1.5 cursor-pointer group select-none transition-colors hover:border-cyan-400/50 shadow-inner"
      title="Click to claim offer & book your ride"
    >
      {/* Subtle Ambient Cyber Neon Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Infinite Horizontal Scrolling Marquee */}
      <div className="flex w-max animate-marquee-infinite items-center gap-10">
        {[...promoItems, ...promoItems, ...promoItems, ...promoItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 shrink-0 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
              <span>{item.badge}</span>
            </span>

            <span className="font-bold text-slate-200 group-hover:text-cyan-200 transition-colors">
              {item.title}
            </span>

            <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-950/70 border border-cyan-500/35 px-2 py-0.5 rounded-md shadow-2xs">
              {item.highlight}
            </span>

            <span className="text-cyan-500/30 text-xs font-mono">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
