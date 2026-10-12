import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={`
            w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
            transition duration-150 focus:outline-hidden focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500
            ${Icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
            }
          `}
          {...props}
        />
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
