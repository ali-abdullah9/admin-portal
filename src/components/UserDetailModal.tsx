"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { Pencil, Trash } from "lucide-react";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserDetailModal({ user, isOpen, onClose, onEdit, onDelete }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
          <DialogDescription>
            Detailed information about {user.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Full Name:</div>
            <div className="col-span-2">{user.fullName}</div>
            
            <div className="font-semibold">CMS ID:</div>
            <div className="col-span-2">{user.cmsId}</div>
            
            <div className="font-semibold">Email:</div>
            <div className="col-span-2">
              <a 
                href={`mailto:${user.email}`} 
                className="text-primary hover:underline"
              >
                {user.email}
              </a>
            </div>
            
            <div className="font-semibold">Department:</div>
            <div className="col-span-2">
              <Badge variant="outline">{user.dept}</Badge>
            </div>
            
            <div className="font-semibold">Role:</div>
            <div className="col-span-2">
              <Badge className={
                user.role === "Admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" :
                user.role === "Teacher" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                user.role === "Student" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                user.role === "Lab Instructors" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }>
                {user.role}
              </Badge>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="font-semibold mb-2">Access Permissions:</div>
            {user.access.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.access.map((accessItem, index) => (
                  <Badge key={index} variant="secondary">
                    {accessItem}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">No access permissions assigned</div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          <div>
            <Button 
              variant="default" 
              className="mr-2 dark: text-white"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit User
            </Button>
            <Button
              className="dark: text-white" 
              variant="destructive"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailModal;