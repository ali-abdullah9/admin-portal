"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Input } from "@/components/ui/input";
import { AccessLog } from "@/components/DataTable";

type FilterState = {
  startDate?: string;
  endDate?: string;
  timeFrame: "daily" | "weekly" | "monthly" | "all";
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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

  // Fetch logs using Convex query
  const logsData = useQuery(api.getAccessLogs.getAccessLog, {
    userId: "",
    roomName: "",
    startDate: filter.startDate,
    endDate: filter.endDate,
  });
  
  const logs = logsData as AccessLog[] | undefined;

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

  // Handle loading state
  if (logs === undefined) {
    return <div className="p-8 text-center">Loading access logs analytics...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Access Logs Analytics</h2>

      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter analytics by date range and time frame</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="max-w-xs">
              <Input
                type="date"
                value={formatDate(filter.startDate)}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="max-w-xs">
              <Input
                type="date"
                value={formatDate(filter.endDate)}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                className="w-full"
              />
            </div>
            <Select 
              value={filter.timeFrame} 
              onValueChange={(value) => setFilter(prev => ({ ...prev, timeFrame: value as "daily" | "weekly" | "monthly" | "all" }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {logs.length === 0 ? (
        <Alert>
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            No access logs found matching the current filters
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Room Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Access Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{logs.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Access Allowed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-500">
                    {logs.filter(log => log.accessStatus === "allowed").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-red-500">
                    {logs.filter(log => log.accessStatus === "denied").length}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Access Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
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
                      label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {processedData.accessStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Access Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedData.roomAccessData.sort((a, b) => b.total - a.total).slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="granted" stackId="a" fill="#00C49F" name="Access Allowed" />
                    <Bar dataKey="denied" stackId="a" fill="#FF8042" name="Access Denied" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Accessed Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {processedData.roomAccessData
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)
                    .map((room, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b">
                        <span>{room.name}</span>
                        <div className="flex gap-4">
                          <span className="text-green-500">{room.granted} allowed</span>
                          <span className="text-red-500">{room.denied} denied</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Attempts Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={processedData.timeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Total Attempts" />
                    <Line type="monotone" dataKey="granted" stroke="#00C49F" name="Access Allowed" />
                    <Line type="monotone" dataKey="denied" stroke="#FF8042" name="Access Denied" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Access Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData.timeSeriesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="granted" fill="#00C49F" name="Access Allowed" />
                      <Bar dataKey="denied" fill="#FF8042" name="Access Denied" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Success Rate Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={processedData.timeSeriesData.map(item => ({
                        date: item.date,
                        rate: item.count ? (item.granted / item.count * 100).toFixed(1) : 0
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit="%" domain={[0, 100]} />
                      <Tooltip formatter={(value: string | number) => [`${value}%`, 'Success Rate']} />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#0088FE" name="Success Rate %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default AccessLogsAnalytics;