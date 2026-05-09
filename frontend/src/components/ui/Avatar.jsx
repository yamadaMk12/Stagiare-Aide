import React from 'react';
import { cn } from '../../lib/utils';

const Avatar = ({ src, fallback, className, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-secondary-100", sizes[size], className)}>
      {src ? (
        <img src={src} alt="avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-secondary-600 uppercase">
          {fallback || '??'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
