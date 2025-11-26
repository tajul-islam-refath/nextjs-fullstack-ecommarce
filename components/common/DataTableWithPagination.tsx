"use client";

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableWithPaginationProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isPending?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  pageSizeOptions?: number[];
}

/**
 * Reusable Data Table with Pagination Component
 *
 * Generic table component that can be used across different pages
 * Supports custom columns, pagination, and loading states
 * Uses shadcn/ui Pagination component for consistent UI
 *
 * @example
 * ```tsx
 * const columns: Column<Category>[] = [
 *   { key: 'name', header: 'Name', render: (item) => item.name },
 *   { key: 'slug', header: 'Slug', render: (item) => <code>{item.slug}</code> },
 * ];
 *
 * <DataTableWithPagination
 *   data={categories}
 *   columns={columns}
 *   pagination={paginationData}
 *   onPageChange={handlePageChange}
 *   onLimitChange={handleLimitChange}
 *   getRowKey={(item) => item.id}
 * />
 * ```
 */
export function DataTableWithPagination<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
  isPending = false,
  emptyMessage = "No data found.",
  getRowKey,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTableWithPaginationProps<T>) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value, 10);
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="text-center py-12">
          <p className="text-slate-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Items Per Page */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <Select
            value={pagination.limit.toString()}
            onValueChange={handleLimitChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-600">per page</span>
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  !isPending &&
                  pagination.hasPrevious &&
                  onPageChange(pagination.page - 1)
                }
                className={
                  isPending || !pagination.hasPrevious
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageNumbers.map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => !isPending && onPageChange(pageNum)}
                    isActive={pageNum === pagination.page}
                    className={
                      isPending
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  !isPending &&
                  pagination.hasNext &&
                  onPageChange(pagination.page + 1)
                }
                className={
                  isPending || !pagination.hasNext
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
