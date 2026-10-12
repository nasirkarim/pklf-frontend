import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  FileText,
  Wallet,
  Briefcase,
  Key,
  Laptop,
  Dog,
  Package,
} from 'lucide-react';

const iconMap = {
  mobile_phones: Smartphone,
  documents: FileText,
  wallets: Wallet,
  bags: Briefcase,
  keys: Key,
  electronics: Laptop,
  pets: Dog,
  other: Package,
};

export const CategoryCard = ({ id, label, icon, count, isSelected = false, onClick }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[id] || Package;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      navigate(`/search?category=${id}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border text-center transition duration-200 cursor-pointer
        ${
          isSelected
            ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'
        }
      `}
    >
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition duration-200
          ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
          }
        `}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      <span className="font-semibold text-xs sm:text-sm text-slate-800 tracking-tight group-hover:text-emerald-800 transition line-clamp-1">
        {label}
      </span>

      {count !== undefined && (
        <span className="mt-1 text-[11px] font-medium text-slate-400 group-hover:text-emerald-600 transition">
          {count} reports
        </span>
      )}
    </button>
  );
};

export default CategoryCard;
