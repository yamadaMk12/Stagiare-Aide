import React from 'react';
const AuthLayout = ({ children }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-secondary-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-3xl border border-secondary-100 bg-white p-8 shadow-soft-lg'>
        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
