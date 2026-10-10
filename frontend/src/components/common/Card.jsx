import React from 'react';

export const Card = ({
  children,
  variant = 'glass', // 'glass', 'solid', 'outline', 'elevated'
  hover = true,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const baseStyles = 'relative rounded-2xl overflow-hidden transition-all duration-300';

  const variantStyles = {
    glass:
      'bg-white border border-slate-200/90 shadow-card',
    solid:
      'bg-white border border-slate-200 shadow-card',
    outline:
      'bg-transparent border border-slate-200 hover:border-slate-300',
    elevated:
      'bg-white border border-slate-100 shadow-xl',
  };

  const hoverStyles = hover
    ? 'hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-card-hover'
    : '';

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
