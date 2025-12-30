import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  error?: string | null;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  pageCount?: number; // Pour pagination côté serveur
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  error,
  onRowClick,
  onRowDoubleClick,
  initialPage = 0,
  onPageChange,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount, // Nombre de pages pour pagination serveur
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex: initialPage,
        pageSize: 15,
      },
    },
    // Si pageCount est fourni, utiliser pagination manuelle (serveur)
    manualPagination: pageCount !== undefined,
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return {
      pages,
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages,
    };
  };

  const { pages, showStartEllipsis, showEndEllipsis } = generatePageNumbers();

  return (
    <div className="space-y-4">
      <div className="w-full border rounded-md">
        <div className="overflow-x-auto scrollbar-custom">
          <table className="w-full caption-bottom text-sm min-w-[800px]">
            <thead className="[&_tr]:border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading || error ? (
                [...Array(10)].map((_, index) => (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {columns.map((_column, columnIndex) => (
                      <td
                        key={columnIndex}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b transition-colors cursor-pointer hover:bg-muted/50 data-[state=selected]:bg-muted"
                        onClick={() => onRowClick?.(row.original)}
                        onDoubleClick={() => onRowDoubleClick?.(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td
                        colSpan={columns.length}
                        className="h-24 p-4 align-middle text-center"
                      >
                        No results.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Pagination>
          <PaginationContent className="flex flex-wrap justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (table.getCanPreviousPage() && onPageChange) {
                    onPageChange(table.getState().pagination.pageIndex - 1);
                  }
                }}
                aria-disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* Première page - visible uniquement sur desktop */}
            {showStartEllipsis && (
              <>
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPageChange) onPageChange(0);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}

            {/* Pages du milieu */}
            {pages.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onPageChange) onPageChange(pageNumber - 1);
                  }}
                  isActive={currentPage === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            {showEndEllipsis && (
              <>
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPageChange) onPageChange(totalPages - 1);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (table.getCanNextPage() && onPageChange) {
                    onPageChange(table.getState().pagination.pageIndex + 1);
                  }
                }}
                aria-disabled={!table.getCanNextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Indicateur de page responsive */}
      <div className="text-sm text-muted-foreground mt-2 text-center">
        Page {currentPage} sur {totalPages}
      </div>
    </div>
  );
}
