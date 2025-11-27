"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  description: string | null;
  specifications?: Record<string, string>;
}

export function ProductTabs({ description, specifications }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");

  return (
    <div className="mt-12">
      {/* Tab Headers */}
      <div className="border-b border-(--gray-200)">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("description")}
            className={cn(
              "border-b-2 pb-4 text-sm font-medium transition-colors",
              activeTab === "description"
                ? "border-(--primary-600) text-(--primary-600)"
                : "border-transparent text-(--gray-500) hover:text-(--gray-700)"
            )}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={cn(
              "border-b-2 pb-4 text-sm font-medium transition-colors",
              activeTab === "specs"
                ? "border-(--primary-600) text-(--primary-600)"
                : "border-transparent text-(--gray-500) hover:text-(--gray-700)"
            )}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "border-b-2 pb-4 text-sm font-medium transition-colors",
              activeTab === "reviews"
                ? "border-(--primary-600) text-(--primary-600)"
                : "border-transparent text-(--gray-500) hover:text-(--gray-700)"
            )}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "description" && (
          <div
            className="prose prose-sm max-w-none text-(--gray-600) overflow-hidden wrap-break-word"
            dangerouslySetInnerHTML={{
              __html: description || "<p>No description available.</p>",
            }}
          />
        )}

        {activeTab === "specs" && (
          <div className="overflow-hidden rounded-lg border border-(--gray-200)">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-(--gray-200)">
                {specifications && Object.entries(specifications).length > 0 ? (
                  Object.entries(specifications).map(([key, value]) => (
                    <tr key={key} className="bg-white">
                      <td className="w-1/3 bg-(--gray-50) px-4 py-3 font-medium text-(--gray-900)">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-(--gray-600)">{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 text-(--gray-500)">
                      No specifications available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-12">
            <p className="text-(--gray-500)">No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
