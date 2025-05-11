/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Input } from "@/components/ui/input";
import { AccessLog } from "@/components/DataTable";
import { 
  AlertCircle, 
  Calendar, 
  BarChart2, 
  ChevronDown, 
  CheckCircle, 
  Filter, 
  LineChart as LineChartIcon, 
  ListChecks, 
  PieChart as PieChartIcon, 
  RefreshCw, 
  TrendingUp, 
  XCircle,
  FileText
} from "lucide-react";

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-[#1a1730] border border-[#342e54] p-3 rounded-md shadow-lg text-white">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

type FilterState = {
  startDate?: string;
  endDate?: string;
  timeFrame: "daily" | "weekly" | "monthly" | "all";
};


const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  // Take only the date part of ISO string
  return dateStr.split('T')[0];
};

export function AccessLogsAnalytics() {
  const [filter, setFilter] = useState<FilterState>({
    startDate: undefined,
    endDate: undefined,
    timeFrame: "all",
  });
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch logs using Convex query
  const logsData = useQuery(api.getAccessLogs.getAccessLog, {
    userId: "",
    roomName: "",
    startDate: filter.startDate,
    endDate: filter.endDate,
  });
  
  const logs = logsData as AccessLog[] | undefined;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };
  
  const filterVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: 24,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  // Prepare data for charts
  const processedData = useMemo(() => {
    if (!logs) return { accessStatusData: [], roomAccessData: [], timeSeriesData: [] };

    // Access status distribution
    const statusCounts: Record<string, number> = {};
    logs.forEach(log => {
      statusCounts[log.accessStatus] = (statusCounts[log.accessStatus] || 0) + 1;
    });
    const accessStatusData = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));

    // Room access distribution
    const roomCounts: Record<string, { granted: number, denied: number }> = {};
    logs.forEach(log => {
      if (!roomCounts[log.roomName]) {
        roomCounts[log.roomName] = { granted: 0, denied: 0 };
      }
      if (log.accessStatus === "allowed") {
        roomCounts[log.roomName].granted += 1;
      } else {
        roomCounts[log.roomName].denied += 1;
      }
    });
    const roomAccessData = Object.keys(roomCounts).map(room => ({
      name: room,
      granted: roomCounts[room].granted,
      denied: roomCounts[room].denied,
      total: roomCounts[room].granted + roomCounts[room].denied
    }));

    // Time series data
    const timeData: Record<string, { date: string, count: number, granted: number, denied: number }> = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      let dateKey;
      
      // Format date based on timeframe
      switch(filter.timeFrame) {
        case "daily":
          dateKey = date.toISOString().split('T')[0];
          break;
        case "weekly":
          const week = Math.floor(date.getDate() / 7) + 1;
          dateKey = `${date.getFullYear()}-W${date.getMonth() + 1}-${week}`;
          break;
        case "monthly":
          dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        default:
          dateKey = date.toISOString().split('T')[0];
      }
      
      if (!timeData[dateKey]) {
        timeData[dateKey] = { 
          date: dateKey, 
          count: 0,
          granted: 0,
          denied: 0
        };
      }
      
      timeData[dateKey].count += 1;
      if (log.accessStatus === "allowed") {
        timeData[dateKey].granted += 1;
      } else {
        timeData[dateKey].denied += 1;
      }
    });

    // Convert to array and sort by date
    const timeSeriesData = Object.values(timeData).sort((a, b) => a.date.localeCompare(b.date));

    return { accessStatusData, roomAccessData, timeSeriesData };
  }, [logs, filter.timeFrame]);

  const handleDateChange = (field: "startDate" | "endDate", dateStr: string) => {
    if (!dateStr) {
      setFilter(prev => ({
        ...prev,
        [field]: undefined
      }));
      return;
    }
    
    try {
      // Create a date object and convert to ISO string
      const date = new Date(dateStr);
      setFilter(prev => ({
        ...prev,
        [field]: date.toISOString()
      }));
    } catch (error) {
      console.error("Invalid date:", error);
    }
  };

  const clearFilters = () => {
    setFilter({
      startDate: undefined,
      endDate: undefined,
      timeFrame: "all",
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Handle loading state
  if (logs === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-white">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-400">Loading access logs analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center gap-1 bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <motion.div
              animate={{ rotate: isFilterVisible ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4 ml-1" />
            </motion.div>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1 bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white"
          >
            <motion.div
              animate={{ rotate: refreshKey * 360 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            <span>Refresh</span>
          </Button>
        </div>
      </motion.div>

      {/* Filter Section */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            key="filter-section"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mb-6 bg-[#1a1730] rounded-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="h-4 w-4 mr-2 text-blue-500" />
                <h3 className="text-lg font-medium text-white">Filters</h3>
              </div>
              <div className="text-sm text-gray-400 mb-4">Filter analytics by date range and time frame</div>
              <div className="flex flex-wrap gap-4">
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="date"
                    value={formatDate(filter.startDate)}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                    className="pl-10 w-full bg-[#262042] border-[#342e54] focus:border-blue-500 text-white"
                    placeholder="Start Date"
                  />
                </div>
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="date"
                    value={formatDate(filter.endDate)}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                    className="pl-10 w-full bg-[#262042] border-[#342e54] focus:border-blue-500 text-white"
                    placeholder="End Date"
                  />
                </div>
                <select 
                  value={filter.timeFrame} 
                  onChange={(e) => setFilter(prev => ({ 
                    ...prev, 
                    timeFrame: e.target.value as "daily" | "weekly" | "monthly" | "all" 
                  }))}
                  className="h-10 rounded-md px-3 bg-[#262042] border-[#342e54] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="all">All Time</option>
                </select>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-[#2d2a40] border-none hover:bg-[#3e3a58] text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {logs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1730] p-6 rounded-md text-white"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="font-bold">No Data</div>
          </div>
          <p className="mt-2 text-gray-400">
            No access logs found matching the current filters
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={`tabs-${activeTab}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Custom Tabs */}
          <div className="mb-6">
            <div className="flex rounded-lg overflow-hidden bg-[#1a1730]/50 p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-lg transition-all ${
                  activeTab === "overview" ? "bg-[#281A41] text-white" : "text-gray-300 hover:bg-[#281A41]/50"
                }`}
              >
                <PieChartIcon className="h-4 w-4" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("rooms")}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-lg transition-all ${
                  activeTab === "rooms" ? "bg-[#281A41] text-white" : "text-gray-300 hover:bg-[#281A41]/50"
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                <span>Room Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-lg transition-all ${
                  activeTab === "timeline" ? "bg-[#281A41] text-white" : "text-gray-300 hover:bg-[#281A41]/50"
                }`}
              >
                <LineChartIcon className="h-4 w-4" />
                <span>Timeline</span>
              </button>
            </div>
          </div>
            
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <motion.div 
                className="grid gap-4 grid-cols-1 md:grid-cols-3"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <div className="bg-[#1a1730] rounded-md p-6 border-l-4 border-blue-500">
                    <div className="text-gray-400 mb-2">Total Access Attempts</div>
                    <div className="text-4xl font-bold text-white">
                      <motion.span
                        key={logs.length}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        {logs.length}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="bg-[#1a1730] rounded-md p-6 border-l-4 border-green-500">
                    <div className="text-gray-400 mb-2">Access Allowed</div>
                    <div className="text-4xl font-bold text-green-400">
                      <motion.span
                        key={logs.filter(log => log.accessStatus === "allowed").length}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        {logs.filter(log => log.accessStatus === "allowed").length}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="bg-[#1a1730] rounded-md p-6 border-l-4 border-red-500">
                    <div className="text-gray-400 mb-2">Access Denied</div>
                    <div className="text-4xl font-bold text-red-400">
                      <motion.span
                        key={logs.filter(log => log.accessStatus === "denied").length}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        {logs.filter(log => log.accessStatus === "denied").length}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="bg-[#1a1730] rounded-md p-6">
                  <div className="flex items-center mb-4">
                    <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium text-white">Access Status Distribution</h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processedData.accessStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name: string, percent: number }) => 
                            `${name === "allowed" ? "Allowed" : "Denied"}: ${(percent * 100).toFixed(0)}%`
                          }
                          animationBegin={0}
                          animationDuration={1000}
                        >
                          {processedData.accessStatusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.name === "allowed" ? "#22c55e" : "#ef4444"} 
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={(value) => value === "allowed" ? "Allowed" : "Denied"} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
            
          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="bg-[#1a1730] rounded-md p-6">
                  <div className="flex items-center mb-4">
                    <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium text-white">Room Access Distribution</h3>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={processedData.roomAccessData.sort((a, b) => b.total - a.total).slice(0, 10)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#342e54" />
                        <XAxis dataKey="name" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="granted" 
                          stackId="a" 
                          fill="#22c55e" 
                          name="Access Allowed"
                          animationBegin={0}
                          animationDuration={1000}
                        />
                        <Bar 
                          dataKey="denied" 
                          stackId="a" 
                          fill="#ef4444" 
                          name="Access Denied"
                          animationBegin={300}
                          animationDuration={1000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="bg-[#1a1730] rounded-md p-6">
                  <div className="flex items-center mb-4">
                    <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium text-white">Top Accessed Rooms</h3>
                  </div>
                  <div className="space-y-2">
                    {processedData.roomAccessData
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map((room, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-[#281A41]/50 border-b border-[#342e54]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <span className="font-medium text-white">{room.name}</span>
                          <div className="flex gap-4">
                            <span className="flex items-center text-green-400">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {room.granted} allowed
                            </span>
                            <span className="flex items-center text-red-400">
                              <XCircle className="h-4 w-4 mr-1" />
                              {room.denied} denied
                            </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
            
          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="bg-[#1a1730] rounded-md p-6">
                  <div className="flex items-center mb-4">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-medium text-white">Access Attempts Over Time</h3>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={processedData.timeSeriesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#342e54" />
                        <XAxis dataKey="date" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          name="Total Attempts"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                          animationBegin={0}
                          animationDuration={1000}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="granted" 
                          stroke="#22c55e" 
                          name="Access Allowed"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                          animationBegin={200}
                          animationDuration={1000}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="denied" 
                          stroke="#ef4444" 
                          name="Access Denied"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                          animationBegin={400}
                          animationDuration={1000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <div className="bg-[#1a1730] rounded-md p-6">
                    <div className="flex items-center mb-4">
                      <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="text-lg font-medium text-white">Access Trends</h3>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={processedData.timeSeriesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#342e54" />
                          <XAxis dataKey="date" stroke="#a0aec0" />
                          <YAxis stroke="#a0aec0" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="granted" 
                            fill="#22c55e" 
                            name="Access Allowed"
                            animationBegin={0}
                            animationDuration={1000}
                          />
                          <Bar 
                            dataKey="denied" 
                            fill="#ef4444" 
                            name="Access Denied"
                            animationBegin={200}
                            animationDuration={1000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="bg-[#1a1730] rounded-md p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="text-lg font-medium text-white">Success Rate Over Time</h3>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={processedData.timeSeriesData.map(item => ({
                            date: item.date,
                            rate: item.count ? (item.granted / item.count * 100).toFixed(1) : 0
                          }))}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#342e54" />
                          <XAxis dataKey="date" stroke="#a0aec0" />
                          <YAxis unit="%" domain={[0, 100]} stroke="#a0aec0" />
                          <Tooltip formatter={(value: string | number) => [`${value}%`, 'Success Rate']} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="#3b82f6" 
                            name="Success Rate %"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                            animationBegin={0}
                            animationDuration={1000}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AccessLogsAnalytics;