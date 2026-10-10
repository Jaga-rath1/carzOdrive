import React from 'react';

export const Container = ({
  children,
  className = '',
  size = 'default', // 'sm', 'default', 'wide', 'full'
  as: Component = 'div',
  ...props
}) => {
  const sizeStyles = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
