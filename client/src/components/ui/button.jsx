// src/components/ui/button.jsx
import React from 'react';

// Utility to merge class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Button variants mapping
const variantStyles = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100',
};

export const Button = React.forwardRef(
  (
    { variant = 'default', className = '', children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';
    const variantClass = variantStyles[variant] || variantStyles.default;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={classNames(
          baseStyles,
          variantClass,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
