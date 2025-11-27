import { Navbar } from "@/components/store/Navbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--gray-50)">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      {/* <footer className="mt-16 border-t border-(--gray-200) bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-(--gray-600)">
            <p>
              &copy; {new Date().getFullYear()} EcoShop. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
