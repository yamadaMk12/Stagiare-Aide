import React from 'react';
import Navbar from '../../components/layout/Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-secondary-50'>
      <Navbar />
      <main className='p-6 lg:p-8'>
        <div className='container-custom'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
