import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface StorePaginationProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
}

export function StorePagination({
  currentPage,
  totalPages,
  createPageUrl,
}: StorePaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevious && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1;
          // Show first page, last page, current page, and pages around current
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={createPageUrl(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }

          // Show ellipsis
          if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null;
        })}

        {hasNext && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
