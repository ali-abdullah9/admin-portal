"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  BarChart2, 
  UserPlus, 
  Edit2 
} from "lucide-react";
import LogsPage from "./LogsPage";
import AccessLogsAnalytics from "./AccessLogsAnalytics";
import { AddUserForm } from "./AddUserForm";
import EditUserForm from "./EditUserForm";

export default function TabComponent() {
  const [activeTab, setActiveTab] = useState("Access Log");

  return (
    <div className="w-full p-6 bg-background rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Admin Dashboard</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-muted/50 p-1 rounded-lg mb-6">
          <TabsTrigger 
            value="Access Log" 
            className="flex items-center gap-2 flex-1 px-4 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium"
          >
            <FileText size={18} />
            <span>Access Logs</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Analytics" 
            className="flex items-center gap-2 flex-1 px-4 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium"
          >
            <BarChart2 size={18} />
            <span>Analytics</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Add" 
            className="flex items-center gap-2 flex-1 px-4 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium"
          >
            <UserPlus size={18} />
            <span>Add User</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="Edit" 
            className="flex items-center gap-2 flex-1 px-4 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all duration-200 font-medium"
          >
            <Edit2 size={18} />
            <span>Edit</span>
          </TabsTrigger>
        </TabsList>

        <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
          <TabsContent value="Access Log" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="py-2">
              <LogsPage />
            </div>
          </TabsContent>

          <TabsContent value="Analytics" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="py-2">
              <AccessLogsAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="Add" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="py-2">
              <AddUserForm />
            </div>
          </TabsContent>

          <TabsContent value="Edit" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="py-2">
              <EditUserForm/>
              </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}