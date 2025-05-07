"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { Eye, Pencil, Trash } from "lucide-react";

// Make sure this matches the server-side type
type FilterState = {
  cmsId: string;
  fullName: string;
  email: string;
  dept?: Department;
  role?: Role;
};

// Debounce hook for input fields
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {user 
            ? "Update user information in the system." 
            : "Add a new user to the system."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
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
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
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
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <button
                    type="button"
                    onClick={() => removeAccess(index)}
                    className="ml-1 rounded-full w-4 h-4 flex items-center justify-center hover:bg-muted-foreground/20"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {user ? "Update User" : "Add User"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function UsersPage() {
  // State for filters
  const [inputFilter, setInputFilter] = useState<FilterState>({
    cmsId: "",
    fullName: "",
    email: "",
    dept: undefined,
    role: undefined,
  });
  
  // Debounce filter values to prevent too many queries
  const debouncedFilter = useDebounce(inputFilter, 500);
  
  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Mutations
  // Make sure these match your actual Convex function names
  const createUser = useMutation(api.users.addUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  // Define all handler functions before using them in the columns definition
  
  // Handle view user button click
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  }, []);

  // Handle add user button click
  const handleAddUserClick = useCallback(() => {
    setIsAddUserOpen(true);
  }, []);

  // Handle edit user button click
  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  }, []);

  // Handle delete user button click
  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  // Handle user view from detail modal
  const handleEditFromDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsEditUserOpen(true);
  }, []);

  // Handle delete from detail modal
  const handleDeleteFromDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof FilterState, value: string | undefined) => {
    if (key === 'dept') {
      // Type narrowing for department
      setInputFilter((prevState) => ({
        ...prevState,
        [key]: value as Department | undefined,
      }));
    } else if (key === 'role') {
      // Type narrowing for role
      setInputFilter((prevState) => ({
        ...prevState,
        [key]: value as Role | undefined,
      }));
    } else {
      // Regular string fields
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

  // Handle add user submit
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

  // Handle edit user submit
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

  // Handle delete user confirm
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

  // Define columns for the data table with proper typing
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
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleEditUser(row.original)}
              className="text-amber-500 hover:text-amber-700 hover:bg-amber-100"
              title="Edit User"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => handleDeleteUser(row.original)}
              title="Delete User"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [handleViewUser, handleEditUser, handleDeleteUser]);

  // Fetch users using Convex query with debounced filter
  const usersData = useQuery(api.users.getUsers, debouncedFilter);
  // Type assertion to help TypeScript understand the structure
  const users = usersData as User[] | undefined;

  // Handle loading state
  if (users === undefined) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Filter by CMS ID"
            value={inputFilter.cmsId}
            onChange={(e) => handleFilterChange("cmsId", e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Filter by Name"
            value={inputFilter.fullName}
            onChange={(e) => handleFilterChange("fullName", e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Filter by Email"
            value={inputFilter.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
            className="max-w-xs"
          />
          
          <Select
            value={inputFilter.dept || ""}
            onValueChange={(value) => {
              // Handle the special "all-depts" case
              if (value === "all-depts") {
                handleFilterChange("dept", undefined);
              } else {
                handleFilterChange("dept", value as Department);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {/* Use a non-empty string for "All" option */}
              <SelectItem value="all-depts">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={inputFilter.role || ""}
            onValueChange={(value) => {
              // Handle the special "all-roles" case
              if (value === "all-roles") {
                handleFilterChange("role", undefined);
              } else {
                handleFilterChange("role", value as Role);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {/* Use a non-empty string for "All" option */}
              <SelectItem value="all-roles">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
          
          <Button className="ml-auto" onClick={handleAddUserClick}>
            Add New User
          </Button>
        </div>
      </div>

      {/* Display no results message if needed */}
      {users?.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          No users found matching the current filters
        </div>
      ) : (
        /* Data Table */
        <div className="rounded-md border">
          <DataTable<User>
            data={users || []}
            columns={columns}
            pagination={true}
            sort={{
              accessorKey: "fullName",
              order: "asc",
            }}
          />
        </div>
      )}

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <UserForm
            title="Add New User"
            onClose={() => setIsAddUserOpen(false)}
            onSubmit={handleAddUserSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
        <AlertDialogContent>
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
            <AlertDialogAction onClick={handleDeleteUserConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UsersPage;