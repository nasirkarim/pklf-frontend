import React from 'react';
import reunivoEmblemImg from '../assets/reunivo-emblem.png';
import reunivoBrandImg from '../assets/reunivo-brand.png';

export const reunivoEmblem = reunivoEmblemImg;
export const reunivoBrand = reunivoBrandImg;

/**
 * Reunivo Brand Emblem Image (Exact user-provided asset)
 */
export const ReunivoEmblem = ({
  className = 'w-9 h-9',
  rounded = 'rounded-xl',
  border = true,
  alt = 'REUNIVO',
}) => {
  return (
    <img
      src={reunivoEmblemImg}
      alt={alt}
      className={`object-cover shrink-0 select-none ${rounded} ${
        border ? 'border border-emerald-500/20 shadow-xs' : ''
      } ${className}`}
    />
  );
};

/**
 * Reunivo Brand Logo Icon (Vector SVG representation)
 */
export const ReunivoIcon = ({ className = 'w-8 h-8', color = 'currentColor' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 58.5C30.8 57.5 12 43.8 12 26.5C12 17.4 18.9 10 27.5 10C31.2 10 34.6 11.4 37.2 13.7"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 10C18.9 10 12 17.4 12 26.5C12 43.8 30.8 57.5 32 58.5C33.2 57.5 52 43.8 52 26.5C52 17.4 45.1 10 37 10C33.3 10 30 11.5 27.5 13.8"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 29C23 29 27 24 33 24C38 24 41 27 41 31C41 35.5 36.5 38 31 38H27"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37 32C37 36 34 40 28 40"
        stroke={color}
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 37.5H41"
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M33 42.5H40"
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M30 47.5H38"
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ReunivoLogo = ({
  size = 'md',
  variant = 'horizontal',
  useImage = true,
  showTagline = false,
  taglineText = 'Lost & Found Community Network',
  className = '',
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isVertical = variant === 'vertical';

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center' : 'items-center gap-3'
      } ${className}`}
    >
      {/* Icon Badge */}
      <div
        className={`flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 ${
          isVertical ? 'mb-2' : ''
        }`}
      >
        {useImage ? (
          <ReunivoEmblem className={iconSizes[size] || 'w-10 h-10'} rounded="rounded-2xl" />
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center border border-emerald-500/30">
            <ReunivoIcon className="w-6 h-6 text-emerald-400" color="#34d399" />
          </div>
        )}
      </div>

      {/* Brand Text */}
      <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'}`}>
        <span
          className={`font-heading font-black tracking-wider uppercase leading-none transition-colors ${
            textSizes[size] || 'text-xl'
          } ${light ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'}`}
          style={{ letterSpacing: '0.08em' }}
        >
          REUNIVO
        </span>
        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-normal mt-1 ${
              light ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReunivoLogo;
