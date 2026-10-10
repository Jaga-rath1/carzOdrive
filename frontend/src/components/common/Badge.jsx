import React from 'react';

export const Badge = ({
  children,
  variant = 'blue', // 'blue', 'cyan', 'emerald', 'amber', 'purple', 'neutral', 'dark'
  size = 'md', // 'sm', 'md', 'lg'
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider',
    md: 'text-xs px-3 py-1 tracking-wide',
    lg: 'text-sm px-3.5 py-1.5',
  };

  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/90 font-semibold',
    cyan: 'bg-sky-50 text-sky-700 border border-sky-200/90 font-semibold',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-semibold',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/90 font-semibold',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    dark: 'bg-slate-950 text-white border border-slate-800 font-semibold',
    gold: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
  };

  const dotColors = {
    blue: 'bg-blue-600',
    cyan: 'bg-sky-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    purple: 'bg-purple-600',
    neutral: 'bg-slate-500',
    dark: 'bg-blue-400',
    gold: 'bg-amber-500',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${dotColors[variant] || 'bg-blue-600'}`}
        />
      )}
      {children}
    </span>
  );
};
