import React from 'react';
import { openWhatsAppChat } from '../../utils/whatsapp';

/**
 * Premium SVG WhatsApp Icon
 */
export const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="0"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83-1.56 1.56-3.63 2.41-5.83 2.41-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.25-8.24m4.51 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.2 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z" />
  </svg>
);

export const WhatsAppButton = ({
  message = '',
  phone,
  label = 'WhatsApp',
  variant = 'outline', // 'solid' | 'outline' | 'icon-only'
  size = 'sm', // 'sm' | 'md' | 'lg'
  className = '',
  onClick,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      openWhatsAppChat(message, phone);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none rounded-xl';

  let sizeStyles = 'px-3 py-2 text-xs gap-1.5';
  let iconSize = 'w-3.5 h-3.5';

  if (size === 'md') {
    sizeStyles = 'px-4 py-2.5 text-xs sm:text-sm gap-2';
    iconSize = 'w-4 h-4';
  } else if (size === 'lg') {
    sizeStyles = 'px-5 py-3 text-sm gap-2.5';
    iconSize = 'w-5 h-5';
  }

  let variantStyles = 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm';

  if (variant === 'solid') {
    variantStyles = 'bg-[#25D366] text-white hover:bg-[#20ba59] shadow-md shadow-emerald-500/20';
  } else if (variant === 'icon-only') {
    sizeStyles = size === 'lg' ? 'p-3' : size === 'md' ? 'p-2.5' : 'p-2';
    variantStyles = 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-xl';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      title="Chat directly on WhatsApp"
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      <WhatsAppIcon className={`${iconSize} shrink-0`} />
      {variant !== 'icon-only' && <span>{label}</span>}
    </button>
  );
};
