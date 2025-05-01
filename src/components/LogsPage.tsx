"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, AccessLog } from "@/components/DataTable";
import { DatePicker } from "@/components/DatePicker";
import { ColumnDef } from "@tanstack/react-table";

type FilterState = {
  userId: string;
  roomName: string;
  startDate?: string;
  endDate?: string;
};

export function LogsPage() {
  const [filter, setFilter] = useState<FilterState>({
    userId: "",
    roomName: "",
    startDate: undefined,
    endDate: undefined,
  });

  // Define columns for the data table with proper typing
  const columns = React.useMemo<ColumnDef<AccessLog>[]>(() => [
    {
      accessorKey: "userId",
      header: () => <span>User ID</span>,
    },
    {
      accessorKey: "roomName",
      header: () => <span>Room</span>,
    },
    {
      accessorKey: "accessStatus",
      header: () => <span>Access Status</span>,
      cell: ({ row }) => {
        const status = row.original.accessStatus;
        return (
          <div className={`capitalize ${status === "denied" ? "text-red-500" : "text-green-500"}`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "timestamp",
      header: () => <span>Timestamp</span>,
      cell: ({ row }) => {
        return new Date(row.original.timestamp).toLocaleString();
      },
    },
  ], []);

  // Fetch logs using Convex query
  const logsData = useQuery(api.getAccessLogs.getAccessLog, filter);
  // Type assertion to help TypeScript understand the structure
  const logs = logsData as AccessLog[] | undefined;

  // Handle loading state
  if (logs === undefined) {
    return <div className="p-8 text-center">Loading access logs...</div>;
  }

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilter((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    handleFilterChange(field, date?.toISOString());
  };

  const clearFilters = () => {
    setFilter({
      userId: "",
      roomName: "",
      startDate: undefined,
      endDate: undefined,
    });
  };
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Access Logs</h2>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Filter by User ID"
            value={filter.userId}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Filter by Room Name"
            value={filter.roomName}
            onChange={(e) => handleFilterChange("roomName", e.target.value)}
            className="max-w-xs"
          />
          <DatePicker
            selectedDate={filter.startDate ? new Date(filter.startDate) : undefined}
            onDateChange={(date) => handleDateChange("startDate", date)}
            placeholder="Start Date"
            className="max-w-xs"
          />
          <DatePicker
            selectedDate={filter.endDate ? new Date(filter.endDate) : undefined}
            onDateChange={(date) => handleDateChange("endDate", date)}
            placeholder="End Date"
            className="max-w-xs"
          />
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Display no results message if needed */}
      {logs?.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          No logs found matching the current filters
        </div>
      ) : (
        /* Data Table */
        <div className="rounded-md border">
          <DataTable<AccessLog>
            data={logs || []}
            columns={columns}
            pagination={true}
            sort={{
              accessorKey: "timestamp",
              order: "desc",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LogsPage;