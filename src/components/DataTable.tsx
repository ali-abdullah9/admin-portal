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
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";

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

  // Track when data changes for animation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animateData, setAnimateData] = React.useState(data);
  
  React.useEffect(() => {
    setAnimateData(data);
  }, [data]);

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

  // Get current sort direction for column
  const getSortDirection = (columnId: string) => {
    const sortedColumn = sorting.find(col => col.id === columnId);
    return sortedColumn ? (sortedColumn.desc ? 'desc' : 'asc') : null;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = getSortDirection(header.id);
                
                return (
                  <TableHead 
                    key={header.id} 
                    className={header.column.getCanSort() ? "cursor-pointer transition-colors duration-200 hover:bg-purple-900/30" : ""}
                    onClick={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      
                      {header.column.getCanSort() && (
                        <div className="w-4 h-4 ml-1 flex items-center justify-center">
                          {sortDirection === 'asc' ? (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronUp className="h-4 w-4 text-blue-400" />
                            </motion.div>
                          ) : sortDirection === 'desc' ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-blue-400" />
                            </motion.div>
                          ) : (
                            <span className="text-gray-500 opacity-0 group-hover:opacity-50 h-4 w-4">•</span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          <AnimatePresence initial={false} mode="sync">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    backgroundColor: index % 2 === 0 ? "rgba(26, 23, 48, 0)" : "rgba(30, 24, 51, 0.3)"
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ 
                    duration: 0.2,
                    delay: index * 0.03, 
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    backgroundColor: "rgba(42, 34, 72, 0.5)",
                    transition: { duration: 0.1 }
                  }}
                  className="border-b border-[#342e54]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    No results found.
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>

      {pagination && (
        <motion.div 
          className="flex items-center justify-between py-4 border-t border-[#342e54] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white flex items-center gap-1"
            >
              Next
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </motion.div>
      )}
    </div>
  );
}