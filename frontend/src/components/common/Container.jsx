import React from 'react';

export const Container = ({
  children,
  className = '',
  size = 'default', // 'sm', 'default', 'wide', 'full'
  as: Component = 'div',
  ...props
}) => {
  const sizeStyles = {
    sm: 'max-w-4xl mx-auto',
    default: 'w-full',
    wide: 'w-full',
    full: 'w-full',
  };

  return (
    <Component
      className={`w-full px-4 sm:px-6 lg:px-10 xl:px-14 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
