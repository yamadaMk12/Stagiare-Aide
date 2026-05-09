import React from 'react';
import { cn } from '../../lib/utils';

const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary-100 p-12 text-center", className)}>
      {Icon && <div className="mb-4 rounded-full bg-secondary-50 p-4 text-secondary-400"><Icon size={48} /></div>}
      <h3 className="mb-2 text-lg font-semibold text-secondary-900">{title}</h3>
      <p className="mb-6 max-w-xs text-sm text-secondary-500">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
