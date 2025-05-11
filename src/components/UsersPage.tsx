"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { User, Department, Role } from "@/types/user";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { UserDetailModal } from "@/components/UserDetailModal";
import { Eye, Pencil, Trash, UserPlus, Filter, X } from "lucide-react";

// Same type definitions as before...
type FilterState = {
  cmsId: string;
  fullName: string;
  email: string;
  dept?: Department;
  role?: Role;
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const departments: Department[] = [
  "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms", "Ns", 
  "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
];

const roles: Role[] = [
  "Teacher", "Student", "Admin", "Lab Instructors", "Intern"
];

// Animation variants for filter section
const filterSectionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

type UserFormProps = {
  user?: User;
  onClose: () => void;
  onSubmit: (user: Omit<User, "_id" | "_creationTime">) => void;
  title: string;
};

function UserForm({ user, onClose, onSubmit, title }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, "_id" | "_creationTime">>({
    fullName: user?.fullName || "",
    cmsId: user?.cmsId || "",
    email: user?.email || "",
    dept: user?.dept || "Seecs",
    role: user?.role || "Student",
    access: user?.access || [],
  });

  const [accessInput, setAccessInput] = useState("");

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addAccess = () => {
    if (accessInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        access: [...prev.access, accessInput.trim()],
      }));
      setAccessInput("");
    }
  };

  const removeAccess = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      access: prev.access.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {user 
            ? "Update user information in the system." 
            : "Add a new user to the system."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="fullName" className="text-right">
            Full Name
          </label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="col-span-3"
            required
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="cmsId" className="text-right">
            CMS ID
          </label>
          <Input
            id="cmsId"
            value={formData.cmsId}
            onChange={(e) => handleChange("cmsId", e.target.value)}
            className="col-span-3"
            required
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="email" className="text-right">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="col-span-3"
            required
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="dept" className="text-right">
            Department
          </label>
          <Select
            value={formData.dept}
            onValueChange={(value) => handleChange("dept", value as Department)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label htmlFor="role" className="text-right">
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value as Role)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="access" className="text-right">
            Access
          </label>
          <div className="col-span-3 space-y-2">
            <div className="flex space-x-2">
              <Input
                id="access"
                value={accessInput}
                onChange={(e) => setAccessInput(e.target.value)}
                placeholder="Add access permission"
              />
              <Button type="button" onClick={addAccess} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.access.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  key={index}
                >
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAccess(index)}
                      className="ml-1 rounded-full w-4 h-4 flex items-center justify-center hover:bg-muted-foreground/20"
                    >
                      ×
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="relative overflow-hidden group">
          <span className="relative z-10">
            {user ? "Update User" : "Add User"}
          </span>
          <motion.div
            className="absolute inset-0 bg-primary/10"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5 }}
          />
        </Button>
      </DialogFooter>
    </motion.form>
  );
}

export function UsersPage() {
  // States for filters and modals (unchanged)
  const [inputFilter, setInputFilter] = useState<FilterState>({
    cmsId: "",
    fullName: "",
    email: "",
    dept: undefined,
    role: undefined,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const debouncedFilter = useDebounce(inputFilter, 500);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Mutations
  const createUser = useMutation(api.users.addUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  // Handler functions (reused from original)
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  }, []);

  const handleAddUserClick = useCallback(() => {
    setIsAddUserOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleEditFromDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsEditUserOpen(true);
  }, []);

  const handleDeleteFromDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string | undefined) => {
    if (key === 'dept') {
      setInputFilter((prevState) => ({
        ...prevState,
        [key]: value as Department | undefined,
      }));
    } else if (key === 'role') {
      setInputFilter((prevState) => ({
        ...prevState,
        [key]: value as Role | undefined,
      }));
    } else {
      setInputFilter((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  }, []);

  const clearFilters = useCallback(() => {
    setInputFilter({
      cmsId: "",
      fullName: "",
      email: "",
      dept: undefined,
      role: undefined,
    });
  }, []);

  // Submit handlers (reused from original)
  const handleAddUserSubmit = useCallback(async (userData: Omit<User, "_id" | "_creationTime">) => {
    try {
      await createUser(userData);
      toast.success("User added", {
        description: `${userData.fullName} has been added successfully.`
      });
      setIsAddUserOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: `Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }, [createUser]);

  const handleEditUserSubmit = useCallback(async (userData: Omit<User, "_id" | "_creationTime">) => {
    if (!selectedUser?._id) return;
    
    try {
      await updateUser({
        id: selectedUser._id as Id<"users">,
        ...userData,
      });
      toast.success("User updated", {
        description: `${userData.fullName} has been updated successfully.`
      });
      setIsEditUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Error", {
        description: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }, [updateUser, selectedUser]);

  const handleDeleteUserConfirm = useCallback(async () => {
    if (!selectedUser?._id) return;
    
    try {
      await deleteUser({ id: selectedUser._id as Id<"users"> });
      toast.success("User deleted", {
        description: `${selectedUser.fullName} has been deleted successfully.`
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Error", {
        description: `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }, [deleteUser, selectedUser]);

  // Table columns
  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: "fullName",
      header: () => <span>Full Name</span>,
    },
    {
      accessorKey: "cmsId",
      header: () => <span>CMS ID</span>,
    },
    {
      accessorKey: "email",
      header: () => <span>Email</span>,
    },
    {
      accessorKey: "dept",
      header: () => <span>Department</span>,
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original.dept}</Badge>;
      },
    },
    {
      accessorKey: "role",
      header: () => <span>Role</span>,
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge className={
            role === "Admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
            role === "Teacher" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
            role === "Student" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
            role === "Lab Instructors" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "access",
      header: () => <span>Access Permissions</span>,
      cell: ({ row }) => {
        const access = row.original.access;
        return (
          <div className="flex flex-wrap gap-1">
            {access.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleViewUser(row.original)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors"
              title="View Details"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Eye className="h-4 w-4" />
              </motion.div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleEditUser(row.original)}
              className="text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
              title="Edit User"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Pencil className="h-4 w-4" />
              </motion.div>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
              onClick={() => handleDeleteUser(row.original)}
              title="Delete User"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Trash className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>
        );
      },
    },
  ], [handleViewUser, handleEditUser, handleDeleteUser]);

  // Fetch users using Convex query
  const usersData = useQuery(api.users.getUsers, debouncedFilter);
  const users = usersData as User[] | undefined;

  // Handle loading state
  if (users === undefined) {
    return (
      <div className="p-8 h-96 flex flex-col items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
          className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent mb-4"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Loading users...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          User Management
        </motion.h2>

        <div className="flex space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleAddUserClick}
              className="gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Add New User</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-primary/20" 
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4 }}
              />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="mb-6 p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm"
            variants={filterSectionVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <motion.h3 
                className="text-lg font-medium"
                variants={itemVariants}
              >
                Filter Users
              </motion.h3>
              <motion.div variants={itemVariants}>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  placeholder="Filter by CMS ID"
                  value={inputFilter.cmsId}
                  onChange={(e) => handleFilterChange("cmsId", e.target.value)}
                  className="w-full"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Input
                  placeholder="Filter by Name"
                  value={inputFilter.fullName}
                  onChange={(e) => handleFilterChange("fullName", e.target.value)}
                  className="w-full"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Input
                  placeholder="Filter by Email"
                  value={inputFilter.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                  className="w-full"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Select
                  value={inputFilter.dept || ""}
                  onValueChange={(value) => {
                    if (value === "all-depts") {
                      handleFilterChange("dept", undefined);
                    } else {
                      handleFilterChange("dept", value as Department);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-depts">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Select
                  value={inputFilter.role || ""}
                  onValueChange={(value) => {
                    if (value === "all-roles") {
                      handleFilterChange("role", undefined);
                    } else {
                      handleFilterChange("role", value as Role);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-roles">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display no results message if needed */}
      {users?.length === 0 ? (
        <motion.div 
          className="text-center py-16 border rounded-md bg-card/30 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-6xl mb-4 text-muted-foreground/30 mx-auto"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            🔍
          </motion.div>
          <p className="text-lg font-medium text-muted-foreground">No users found matching the current filters</p>
        </motion.div>
      ) : (
        /* Data Table */
        <motion.div 
          className=" overflow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DataTable<User>
            data={users || []}
            columns={columns}
            pagination={true}
            sort={{
              accessorKey: "fullName",
              order: "asc",
            }}
          />
        </motion.div>
      )}

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-lg">
          <UserForm
            title="Add New User"
            onClose={() => setIsAddUserOpen(false)}
            onSubmit={handleAddUserSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-lg">
          {selectedUser && (
            <UserForm
              title="Edit User"
              user={selectedUser}
              onClose={() => {
                setIsEditUserOpen(false);
                setSelectedUser(null);
              }}
              onSubmit={handleEditUserSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        onEdit={handleEditFromDetailModal}
        onDelete={handleDeleteFromDetailModal}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user
                {selectedUser && ` "${selectedUser.fullName}"`} and remove their data 
                from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AlertDialogAction 
                  onClick={handleDeleteUserConfirm}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10">Delete</span>
                  <motion.div
                    className="absolute inset-0 bg-destructive/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </AlertDialogAction>
              </motion.div>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default UsersPage;