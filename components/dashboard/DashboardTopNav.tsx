'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { DashboardTopNavProps } from './types';
import SignOutButton from '@/app/admin/SignOutButton';

/**
 * DashboardTopNav Component
 * 
 * Features:
 * - Sticky positioning at top
 * - Mobile menu toggle
 * - User profile display
 * - Notifications placeholder
 * - Search functionality placeholder
 */
export function DashboardTopNav({ user, onMenuToggle }: DashboardTopNavProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section: Mobile Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200" />

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">
                {user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {user.role || 'Admin'}
              </p>
            </div>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Sign Out Button */}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
