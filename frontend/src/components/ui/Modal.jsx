import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-secondary-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 shadow-soft-lg transition-all animate-in fade-in zoom-in duration-200",
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-secondary-900">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
            <X size={18} />
          </Button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
