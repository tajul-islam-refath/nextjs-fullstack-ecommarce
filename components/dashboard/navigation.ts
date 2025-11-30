import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Truck,
} from "lucide-react";
import { NavItem } from "./types";

/**
 * Main navigation items for the dashboard
 * Icons from lucide-react for consistency
 */
export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    label: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  // {
  //   label: "Customers",
  //   href: "/admin/customers",
  //   icon: Users,
  // },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  // {
  //   label: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  // },
];
