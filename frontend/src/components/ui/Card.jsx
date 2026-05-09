import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-2xl border border-secondary-100 bg-white shadow-soft transition-default",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
