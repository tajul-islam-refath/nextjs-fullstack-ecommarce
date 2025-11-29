import { auth } from "@/auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { DashboardStats } from "@/components/admin/DashboardStats";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const session = await auth();
  const statsResult = await getDashboardStats();

  // Handle error case
  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load dashboard statistics</p>
        </div>
      </div>
    );
  }

  const { totalProducts, ...orderStats } = statsResult.data;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.email?.split("@")[0]}!
        </h2>
        <p className="text-blue-100">
          Manage your e-commerce platform from this admin dashboard
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats totalProducts={totalProducts} orderStats={orderStats} />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/create"
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="font-medium text-slate-700">Add Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="bg-green-100 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="font-medium text-slate-700">View Orders</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <span className="font-medium text-slate-700">Categories</span>
          </Link>

          <Link
            href="/admin/banners"
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="bg-orange-100 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="font-medium text-slate-700">Banners</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-slate-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-slate-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
