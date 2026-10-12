import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const isBusy = isLoading || loading;

  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] select-none';

  const variants = {
    primary:
      'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xs focus-visible:ring-emerald-600',
    secondary:
      'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-xs focus-visible:ring-slate-700',
    outline:
      'border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
    outlinePrimary:
      'border border-emerald-600 hover:bg-emerald-50 text-emerald-800 focus-visible:ring-emerald-500',
    outlineDark:
      'border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700 text-white shadow-xs focus-visible:ring-slate-600',
    white:
      'bg-white hover:bg-slate-100 text-slate-900 font-bold shadow-xs focus-visible:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus-visible:ring-rose-500',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isBusy}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isBusy ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
