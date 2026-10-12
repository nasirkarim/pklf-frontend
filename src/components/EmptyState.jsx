import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const EmptyState = ({
  title = 'No reports found',
  description = 'Try adjusting your search criteria, selecting a different city, or removing filters.',
  actionLabel,
  actionTo,
  onAction,
  icon: Icon = PackageSearch,
}) => {
  return (
    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
      <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-slate-500" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {actionTo && actionLabel && (
        <Link to={actionTo}>
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}

      {onAction && actionLabel && !actionTo && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
