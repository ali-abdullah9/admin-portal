"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, AccessLog } from "@/components/DataTable";
import { DatePicker } from "@/components/DatePicker";
import { ColumnDef } from "@tanstack/react-table";
import { 
  FileText, 
  Filter,
  X
} from "lucide-react";

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
  
  const [isFiltered, setIsFiltered] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Check if any filter is active
  useEffect(() => {
    const hasActiveFilter = 
      filter.userId !== "" || 
      filter.roomName !== "" || 
      filter.startDate !== undefined || 
      filter.endDate !== undefined;
    
    setIsFiltered(hasActiveFilter);
  }, [filter]);

  // Define columns for the data table with proper typing
  const columns = React.useMemo<ColumnDef<AccessLog>[]>(() => [
    {
      accessorKey: "userId",
      header: () => <span>User ID</span>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.userId}</div>
      ),
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
          <div className={`capitalize ${
            status === "denied" 
              ? "text-red-400" 
              : "text-green-400"
          }`}>
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
  
  // Calculate statistics
  const calculateStats = () => {
    if (!logs) return { total: 0, allowed: 0, denied: 0 };
    
    const allowed = logs.filter(log => log.accessStatus === "allowed").length;
    
    return {
      total: logs.length,
      allowed,
      denied: logs.length - allowed
    };
  };
  
  const stats = calculateStats();
  
  // Handle loading state
  if (logs === undefined) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <p>Loading access logs...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 text-white p-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Access Logs</h2>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="bg-[#2d2a40] border-none hover:bg-[#3e3a58] flex items-center gap-2 text-white"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e1b2e] rounded-md p-6 border-l-4 border-blue-500">
          <div className="text-gray-400 mb-2">Total Entries</div>
          <div className="text-4xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-[#1e1b2e] rounded-md p-6 border-l-4 border-green-500">
          <div className="text-gray-400 mb-2">Access Allowed</div>
          <div className="text-4xl font-bold text-green-400">{stats.allowed}</div>
        </div>
        
        <div className="bg-[#1e1b2e] rounded-md p-6 border-l-4 border-red-500">
          <div className="text-gray-400 mb-2">Access Denied</div>
          <div className="text-4xl font-bold text-red-400">{stats.denied}</div>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-[#1e1b2e] rounded-md p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-lg font-medium">Filter Options</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">User ID</label>
              <Input
                placeholder="Filter by User ID"
                value={filter.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                className="bg-[#12101f] border-[#2d2a40] focus:border-blue-500 text-white placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Room Name</label>
              <Input
                placeholder="Filter by Room Name"
                value={filter.roomName}
                onChange={(e) => handleFilterChange("roomName", e.target.value)}
                className="bg-[#12101f] border-[#2d2a40] focus:border-blue-500 text-white placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Start Date</label>
              <DatePicker
                selectedDate={filter.startDate ? new Date(filter.startDate) : undefined}
                onDateChange={(date) => handleDateChange("startDate", date)}
                placeholder="Start Date"
                className="w-full bg-[#12101f] border-[#2d2a40] text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">End Date</label>
              <DatePicker
                selectedDate={filter.endDate ? new Date(filter.endDate) : undefined}
                onDateChange={(date) => handleDateChange("endDate", date)}
                placeholder="End Date"
                className="w-full bg-[#12101f] border-[#2d2a40] text-white"
              />
            </div>
          </div>
          
          {isFiltered && (
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Display no results message if needed */}
      {logs?.length === 0 ? (
        <div className="text-center py-12 bg-[#1e1b2e] rounded-md">
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-semibold">No Logs Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No access logs match your current filter criteria. Try changing your filters or clearing them to see all logs.
            </p>
            {isFiltered && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4 bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-[#1e1b2e] rounded-md overflow-hidden p-2">
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