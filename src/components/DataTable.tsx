"use client";

import * as React from "react";
import { 
  ColumnDef, 
  flexRender, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  useReactTable, 
  SortingState, 
  PaginationState
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Define the AccessLog type
export type AccessLog = {
  userId: string;
  roomName: string;
  accessStatus: "allowed" | "denied";
  timestamp: string;
};

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination?: boolean;
  sort?: {
    accessorKey: string;
    order: "asc" | "desc";
  };
}

export function DataTable<TData>({ 
  columns, 
  data, 
  pagination = false, 
  sort 
}: DataTableProps<TData>) {
  // Initialize sorting based on the prop if provided
  const initialSorting: SortingState = sort 
    ? [{ id: sort.accessorKey, desc: sort.order === "desc" }] 
    : [];

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id} 
                  className={header.column.getCanSort() ? "cursor-pointer" : ""}
                  onClick={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </div>
      )}
    </div>
  );
}