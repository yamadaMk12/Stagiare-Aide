import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = ({ title, children, variant = 'info', className }) => {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-600" />,
    success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-600" />,
    danger: <XCircle className="h-5 w-5 text-red-600" />,
  };

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", variants[variant], className)}>
      <div className="shrink-0">{icons[variant]}</div>
      <div className="flex flex-col gap-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
