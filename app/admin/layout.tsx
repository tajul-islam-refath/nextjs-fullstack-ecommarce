import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";

/**
 * Admin Layout
 *
 * Wraps all admin pages with authentication check and dashboard layout.
 * Note: auth() accesses cookies, which automatically opts this layout out
 * of caching when cacheComponents is enabled.
 */

import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}

async function AdminContent({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect("/signin");
  }

  // Extract user data for dashboard
  const user = {
    email: session.user.email || "",
    role: (session.user as any).role || "admin",
    image: session.user.image,
  };

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
