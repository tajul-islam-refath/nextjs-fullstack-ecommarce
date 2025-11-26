'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardSidebarProps } from './types';
import { navigationItems } from './navigation';

/**
 * DashboardSidebar Component
 * 
 * Features:
 * - Sticky positioning for desktop
 * - Collapsible on mobile with overlay
 * - Active route highlighting
 * - Smooth transitions
 * - Accessible navigation
 */
export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base styles
          'fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200',
          'w-64 flex flex-col',
          // Transition
          'transition-transform duration-300 ease-in-out',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg text-slate-900">
              E-Commerce
            </span>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      // Base styles
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'group relative',
                      // Active state
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                    )}

                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive
                          ? 'text-blue-600'
                          : 'text-slate-500 group-hover:text-slate-700'
                      )}
                    />

                    <span className="flex-1">{item.label}</span>

                    {/* Badge */}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="px-3 py-2 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600">Admin Panel</p>
            <p className="text-xs text-slate-500 mt-0.5">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
