"use client"

import { useState } from "react"
import { Loader2, UserCog, Building, BookOpen, Beaker, Users, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

// Define types for better TypeScript support
interface UserData {
  _id: string;
  _creationTime: number;
  fullName: string;
  email: string;
  dept: string;
  role: string;
  access: string[];
  cmsId: string;
}

interface AccessOptions {
  allClasses: string[];
  labs: Record<string, string[]>;
  staffRooms: Record<string, string[]>;
  personalRooms: Record<string, string[]>;
}

export default function EditUserForm() {
  // State
  const [cmsId, setCmsId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [userRole, setUserRole] = useState<string>("")
  const [userAccess, setUserAccess] = useState<string[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Convex mutations - we'll use these directly instead of queries
  const editUser = useMutation(api.editUser.editUser)
  const getUserByCmsId = useMutation(api.users.getUserByCmsIdMutation)
  
  // Mock departments and access data
  const departments = [
    "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms",
    "Ns", "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
  ]
  
  // Generate access options for departments
  const generateAccessOptions = (): AccessOptions => {
    const allClasses: string[] = []
    const labs: Record<string, string[]> = {}
    const staffRooms: Record<string, string[]> = {}
    const personalRooms: Record<string, string[]> = {}
    
    departments.forEach(dept => {
      // Create classes for each department
      const deptClasses = Array.from({ length: 15 }, (_, i) => `${dept} Class ${i + 1}`)
      allClasses.push(...deptClasses)
      
      // Create labs for each department
      labs[dept] = Array.from({ length: 5 }, (_, i) => `${dept} Lab ${i + 1}`)
      
      // Create staff room for each department
      staffRooms[dept] = [`${dept} Staff Room`]
      
      // Create personal rooms for each department
      personalRooms[dept] = Array.from({ length: 10 }, (_, i) => `${dept} Personal Room ${i + 1}`)
    })
    
    return { allClasses, labs, staffRooms, personalRooms }
  }
  
  const accessOptions = generateAccessOptions()
  
  // Handle search button click - using mutation instead of query
  const handleSearch = async () => {
    if (!cmsId) {
      setErrorMessage("Please enter a CMS ID")
      return
    }
    
    setIsSearching(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setUserData(null)
    
    try {
      // Call the mutation directly instead of using a query
      const user = await getUserByCmsId({ cmsId: cmsId })
      
      if (!user) {
        setErrorMessage(`No user exists with the CMS ID: ${cmsId}.`)
        setIsSearching(false)
        return
      }
      
      setUserData(user)
      setUserRole(user.role)
      setUserAccess(user.access)
      updateFilteredOptions(user.dept, user.role)
      setIsSearching(false)
    } catch (error) {
      console.error("Error fetching user:", error)
      setErrorMessage("Error fetching user data. Please try again.")
      setIsSearching(false)
    }
  }
  
  // Update filtered options based on department and role
  const updateFilteredOptions = (dept: string, role: string): void => {
    if (!dept) return
    
    const options: string[] = []
    
    // Add all classes
    options.push(...accessOptions.allClasses)
    
    // Add labs from user's department
    if (accessOptions.labs[dept]) {
      options.push(...accessOptions.labs[dept])
    }
    
    // Add staff room from user's department
    if (accessOptions.staffRooms[dept]) {
      options.push(...accessOptions.staffRooms[dept])
    }
    
    // Add personal rooms for Teacher and Admin roles
    if ((role === "Teacher" || role === "Admin") && accessOptions.personalRooms[dept]) {
      options.push(...accessOptions.personalRooms[dept])
    }
    
    setFilteredOptions(options)
  }
  
  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newRole = e.target.value
    setUserRole(newRole)
    
    if (userData) {
      updateFilteredOptions(userData.dept, newRole)
    }
  }
  
  // Handle access selection change
  const handleAccessChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value)
    setUserAccess(selected)
  }
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!userData || !cmsId) return
    
    setIsSearching(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    
    try {
      // Call the Convex mutation to update the user
      await editUser({
        cmsId: cmsId,
        role: userRole as "Teacher" | "Student" | "Admin" | "Lab Instructors" | "Intern",
        access: userAccess
      })
      
      setSuccessMessage("User updated successfully!")
      setIsSearching(false)
    } catch (error) {
      console.error("Error updating user:", error)
      setErrorMessage("Error updating user. Please try again.")
      setIsSearching(false)
    }
  }
  
  // Reset form
  const resetForm = () => {
    setCmsId("")
    setUserRole("")
    setUserAccess([])
    setUserData(null)
    setFilteredOptions([])
    setErrorMessage(null)
    setSuccessMessage(null)
  }
  
  // Handle pressing Enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
  
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* User info panel */}
      {userData && !isSearching && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
              <p className="mt-1">{userData.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
              <p className="mt-1 break-words">{userData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h3>
              <p className="mt-1">{userData.dept}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
              <p className="mt-1">{userData.role}</p>
            </div>
          </div>
        </div>
      )}
      
      <Card className="overflow-hidden border-t-4 border-t-blue-600 shadow-lg">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/30 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Edit User</CardTitle>
              <CardDescription>Update role and access privileges for an existing user</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Search Section */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">CMS ID</label>
                <Input 
                  placeholder="e.g. 413814" 
                  className="bg-white dark:bg-gray-950" 
                  value={cmsId}
                  onChange={(e) => setCmsId(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !cmsId}
                className="mb-[2px] dark: text-white"
              >
                {isSearching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Search
              </Button>
            </div>
            
            {/* Loading State */}
            {isSearching && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && !isSearching && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 ">
                <div className=""></div>
                <div className="flex items-start gap-2 py-1 ">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-sm whitespace-normal ">
                    {errorMessage}
                  </span>
                </div>
              </Alert>
            )}
            
            {/* Success Message */}
            {successMessage && !isSearching && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className=""></div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <AlertDescription className="font-medium text-green-800 dark:text-green-300">{successMessage}</AlertDescription>
                </div>
              </Alert>
            )}
            
            {/* User Found State - Edit Section */}
            {userData && !isSearching && (
              <div className="mt-6">
                <h3 className="text-base font-medium flex items-center gap-2 mb-4">
                  <span>Update Permissions & Access</span>
                  <Separator className="flex-1 ml-2" />
                </h3>
                
                <div className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <select
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                      value={userRole}
                      onChange={handleRoleChange}
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                      <option value="Lab Instructors">Lab Instructor</option>
                      <option value="Intern">Intern</option>
                    </select>
                    {(userRole === "Student" || userRole === "Intern" || userRole === "Lab Instructors") && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Note: Only teachers and admins can access personal rooms
                      </p>
                    )}
                  </div>

                  {/* Access Privileges */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                      <label className="text-sm font-medium">Access Privileges</label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Classes</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Beaker className="h-3 w-3" />
                          <span>Labs</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Staff Room</span>
                        </Badge>
                        {(userRole === "Teacher" || userRole === "Admin") && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>Personal Rooms</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <select
                      multiple
                      className="w-full h-64 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                      value={userAccess}
                      onChange={handleAccessChange}
                    >
                      {filteredOptions.map((opt: string) => (
                        <option key={opt} value={opt} className={
                          opt.includes("Class") ? "text-blue-600 dark:text-blue-400" :
                          opt.includes("Lab") ? "text-amber-600 dark:text-amber-400" :
                          opt.includes("Staff Room") ? "text-purple-600 dark:text-purple-400" :
                          "text-green-600 dark:text-green-400"
                        }>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Hold Ctrl/Cmd to select multiple locations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end bg-gray-50 dark:bg-gray-800/30 border-t px-6 py-4">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="bg-white hover:bg-gray-100 dark:bg-transparent dark:hover:bg-gray-800"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              disabled={!userData || isSearching}
            >
              <UserCog className="h-4 w-4" />
              Update User
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}