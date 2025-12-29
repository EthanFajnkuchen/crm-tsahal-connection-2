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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
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
    // Mode contrôlé manuel pour la pagination
    manualPagination: false,
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
    <div>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading || error ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onRowClick?.(row.original)}
                      onDoubleClick={() => onRowDoubleClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 overflow-x-auto">
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
