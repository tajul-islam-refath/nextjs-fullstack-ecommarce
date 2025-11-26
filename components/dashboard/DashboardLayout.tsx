'use client';

import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { DashboardLayoutProps } from './types';

/**
 * DashboardLayout Component
 * 
 * Main layout wrapper that composes sidebar and top navigation.
 * 
 * Features:
 * - Responsive grid layout
 * - Mobile sidebar state management
 * - Sticky sidebar and topnav
 * - Proper content scrolling
 * 
 * Usage:
 * ```tsx
 * <DashboardLayout user={{ email: 'user@example.com', role: 'admin' }}>
 *   <YourContent />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Sticky on desktop, overlay on mobile */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation - Sticky at top */}
        <DashboardTopNav user={user} onMenuToggle={handleMenuToggle} />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 xl:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
