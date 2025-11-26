import { LucideIcon } from 'lucide-react';

/**
 * Navigation item structure
 * Used for sidebar and navigation menus
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

/**
 * User session information
 * Matches NextAuth session structure
 */
export interface DashboardUser {
  email: string;
  role?: string;
  image?: string | null;
}

/**
 * Dashboard layout props
 */
export interface DashboardLayoutProps {
  children: React.ReactNode;
  user: DashboardUser;
}

/**
 * Sidebar props
 */
export interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Top navigation props
 */
export interface DashboardTopNavProps {
  user: DashboardUser;
  onMenuToggle: () => void;
}
