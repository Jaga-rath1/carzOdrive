import React from 'react';
import { Badge } from './Badge';

export const SectionHeading = ({
  badge,
  badgeVariant = 'blue',
  title,
  highlight,
  subtitle,
  align = 'center', // 'center' or 'left'
  className = '',
  action,
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-12 md:mb-16 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'flex flex-col md:flex-row md:items-end justify-between gap-6'
      } ${className}`}
    >
      <div className={!isCenter ? 'max-w-2xl' : ''}>
        {badge && (
          <div className={`mb-3.5 ${isCenter ? 'flex justify-center' : ''}`}>
            <Badge variant={badgeVariant} dot>
              {badge}
            </Badge>
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
          {title}{' '}
          {highlight && (
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </h2>

        {subtitle && (
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {!isCenter && action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  );
};
