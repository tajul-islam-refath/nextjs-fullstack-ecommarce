"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import {
  DataTableWithPagination,
  Column,
  PaginationData,
} from "@/components/common/DataTableWithPagination";
import { usePagination } from "@/hooks/usePagination";
import { Banner } from "@/app/generated/prisma/client";
import {
  deleteBannerAction,
  toggleBannerStatusAction,
} from "@/lib/actions/banner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface BannerManagementClientProps {
  initialBanners: Banner[];
  initialPagination: PaginationData;
}

export function BannerManagementClient({
  initialBanners,
  initialPagination,
}: BannerManagementClientProps) {
  const router = useRouter();
  const { isPending, handlePageChange, handleLimitChange } = usePagination(
    initialPagination.totalPages,
    initialPagination.limit
  );

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    banner?: Banner;
  }>({
    open: false,
  });

  const handleDelete = async () => {
    if (!deleteDialog.banner) return;

    try {
      const result = await deleteBannerAction(deleteDialog.banner.id);
      if (result.success) {
        toast.success("Banner deleted successfully");
        setDeleteDialog({ open: false });
      } else {
        toast.error(result.error || "Failed to delete banner");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      const result = await toggleBannerStatusAction(banner.id);
      if (result.success) {
        toast.success(
          `Banner ${result.data?.isActive ? "activated" : "deactivated"}`
        );
      } else {
        toast.error(result.error || "Failed to update banner status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  // Define table columns
  const columns: Column<Banner>[] = [
    {
      key: "image",
      header: "Banner",
      render: (banner) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-32 h-16 rounded bg-slate-100 overflow-hidden border">
            <img
              src={banner.imageUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      key: "link",
      header: "Link",
      render: (banner) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {banner.linkUrl ? (
            <>
              <LinkIcon className="h-4 w-4" />
              <span className="truncate max-w-[200px]">{banner.linkUrl}</span>
            </>
          ) : (
            <span className="text-slate-400 italic">No link</span>
          )}
        </div>
      ),
    },
    {
      key: "position",
      header: "Order",
      render: (banner) => (
        <span className="font-mono text-sm">{banner.position}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (banner) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={banner.isActive}
            onCheckedChange={() => handleToggleStatus(banner)}
          />
          <span
            className={`text-xs font-medium ${
              banner.isActive ? "text-green-600" : "text-slate-500"
            }`}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (banner) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hover:bg-blue-50 hover:border-blue-200"
          >
            <a href={`/admin/banners/${banner.id}/edit`}>
              <Pencil className="h-4 w-4 text-blue-600" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialog({ open: true, banner })}
            className="hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Banners</h1>
          <p className="text-slate-600 mt-1">
            Manage your promotional banners ({initialPagination.total} total)
          </p>
        </div>
        <Button asChild>
          <a href="/admin/banners/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </a>
        </Button>
      </div>

      {/* Data Table with Pagination */}
      <DataTableWithPagination
        data={initialBanners}
        columns={columns}
        pagination={initialPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isPending={isPending}
        emptyMessage="No banners found. Create your first banner to get started."
        getRowKey={(banner) => banner.id}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        onConfirm={handleDelete}
        isDeleting={isPending}
        itemName="Banner"
      />
    </div>
  );
}
