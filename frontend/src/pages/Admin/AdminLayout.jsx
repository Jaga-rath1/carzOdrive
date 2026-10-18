import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { getCurrentUser } from '../../services/api';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentUser = getCurrentUser();

  const isAdmin = currentUser?.role && (currentUser.role.includes('ADMIN') || currentUser.role === 'SUPER_ADMIN');

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // Page title resolution
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/bookings')) return 'Bookings & Payment History';
    if (path.includes('/admin/vehicles')) return 'Cars Fleet Management';
    if (path.includes('/admin/bikes')) return 'Bikes Fleet Management';
    if (path.includes('/admin/drivers')) return 'Driver Verification Portal';
    if (path.includes('/admin/vendor-fleet')) return 'Vendor Fleet Approvals';
    if (path.includes('/admin/users') || path.includes('/admin/staff')) return 'Staff & Access Control';
    return 'Executive Dashboard';
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        <AdminNavbar
          pageTitle={getPageTitle()}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
