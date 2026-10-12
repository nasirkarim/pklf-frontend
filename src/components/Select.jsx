import React, { useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || name || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helperText
              ? `${selectId}-helper`
              : undefined
          }
          className={`
            w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900
            transition duration-150 focus:outline-hidden focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
            }
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const isObject = typeof opt === 'object' && opt !== null;
            const val = isObject ? opt.value || opt.id : opt;
            const text = isObject ? opt.label || opt.name : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Select;
