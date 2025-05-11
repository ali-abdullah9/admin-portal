"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  UserCog, 
  Building, 
  BookOpen, 
  Beaker, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Search,
  RefreshCw
} from "lucide-react"
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
  const [isUpdating, setIsUpdating] = useState(false)
  
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
    
    setIsUpdating(true)
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
      setIsUpdating(false)
    } catch (error) {
      console.error("Error updating user:", error)
      setErrorMessage("Error updating user. Please try again.")
      setIsUpdating(false)
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
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* User info panel */}
        <AnimatePresence>
          {userData && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mb-6 bg-[#1A1730] rounded-lg p-4 border border-[#342e54] text-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Name</h3>
                  <p className="mt-1 text-white">{userData.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Email</h3>
                  <p className="mt-1 break-words text-white">{userData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Department</h3>
                  <p className="mt-1 text-white">{userData.dept}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Role</h3>
                  <p className="mt-1 text-white">{userData.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="bg-[#140D28] rounded-lg overflow-hidden border border-[#342e54] shadow-lg">
          {/* Header */}
          <div className="bg-[#1A1730] p-4 pb-4">
            <div className="flex items-center gap-2">
              <motion.div 
                className="p-2 rounded-full bg-blue-500/10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <UserCog className="h-6 w-6 text-blue-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-medium text-white">Edit User</h2>
                <p className="text-gray-400 text-sm">Update role and access privileges for an existing user</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Search Section */}
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-white">CMS ID</label>
                  <Input 
                    placeholder="e.g. 413814" 
                    className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500" 
                    value={cmsId}
                    onChange={(e) => setCmsId(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !cmsId}
                    className="mb-[2px] bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    {isSearching ? 
                      <Loader2 className="h-4 w-4 animate-spin" /> : 
                      <Search className="h-4 w-4" />
                    }
                    Search
                  </Button>
                </motion.div>
              </div>
              
              {/* Loading State */}
              <AnimatePresence>
                {isSearching && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-center py-8"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-8 w-8 text-blue-400" />
                      </motion.div>
                      <p className="text-gray-400">Searching for user...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Alert className="bg-[#291A1A] border border-red-500/20 text-red-300">
                      <div className="flex items-start gap-2 py-1">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-sm whitespace-normal">
                          {errorMessage}
                        </span>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Success Message */}
              <AnimatePresence>
                {successMessage && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Alert className="bg-[#193029] border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <AlertDescription className="font-medium text-green-300">{successMessage}</AlertDescription>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* User Found State - Edit Section */}
              <AnimatePresence>
                {userData && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mt-6 overflow-hidden"
                  >
                    <h3 className="text-base font-medium flex items-center gap-2 mb-4 text-white">
                      <span>Update Permissions & Access</span>
                      <Separator className="flex-1 ml-2 bg-[#342e54]" />
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Role Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Role</label>
                        <select
                          className="w-full rounded-md border border-[#262042] bg-[#15132F] px-3 py-2 text-sm text-white"
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
                          <p className="text-xs text-gray-400">
                            Note: Only teachers and admins can access personal rooms
                          </p>
                        )}
                      </div>

                      {/* Access Privileges */}
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-white">Access Privileges</label>
                          <div className="flex flex-wrap gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                              <Badge variant="outline" className="flex items-center gap-1 bg-[#201C38] border-blue-500/20">
                                <BookOpen className="h-3 w-3 text-blue-400" />
                                <span className="text-blue-400">Classes</span>
                              </Badge>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                              <Badge variant="outline" className="flex items-center gap-1 bg-[#201C38] border-amber-500/20">
                                <Beaker className="h-3 w-3 text-amber-400" />
                                <span className="text-amber-400">Labs</span>
                              </Badge>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                              <Badge variant="outline" className="flex items-center gap-1 bg-[#201C38] border-purple-500/20">
                                <Users className="h-3 w-3 text-purple-400" />
                                <span className="text-purple-400">Staff Room</span>
                              </Badge>
                            </motion.div>
                            <AnimatePresence>
                              {(userRole === "Teacher" || userRole === "Admin") && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Badge variant="outline" className="flex items-center gap-1 bg-[#201C38] border-green-500/20">
                                    <Building className="h-3 w-3 text-green-400" />
                                    <span className="text-green-400">Personal Rooms</span>
                                  </Badge>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        <motion.div
                          initial={{ height: 100, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <select
                            multiple
                            className="w-full h-64 rounded-md border border-[#262042] bg-[#15132F] px-3 py-2 text-sm text-white"
                            value={userAccess}
                            onChange={handleAccessChange}
                          >
                            {filteredOptions.map((opt: string) => (
                              <option key={opt} value={opt} className={
                                opt.includes("Class") ? "text-blue-400" :
                                opt.includes("Lab") ? "text-amber-400" :
                                opt.includes("Staff Room") ? "text-purple-400" :
                                "text-green-400"
                              }>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </motion.div>
                        <p className="text-xs text-gray-400">
                          Hold Ctrl/Cmd to select multiple locations
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected access count indicator */}
              <AnimatePresence>
                {userAccess.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 bg-[#1A1730] p-3 rounded-lg border border-[#342e54] text-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Selected Access Points
                      </span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-none">
                        {userAccess.length} selected
                      </Badge>
                    </div>

                    {/* Access type counts */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-[#201C38] border-blue-500/20 text-blue-400">
                        {userAccess.filter((a) => a.includes("Class")).length} Classes
                      </Badge>
                      <Badge variant="outline" className="bg-[#201C38] border-amber-500/20 text-amber-400">
                        {userAccess.filter((a) => a.includes("Lab")).length} Labs
                      </Badge>
                      <Badge variant="outline" className="bg-[#201C38] border-purple-500/20 text-purple-400">
                        {userAccess.filter((a) => a.includes("Staff Room")).length} Staff Rooms
                      </Badge>
                      <Badge variant="outline" className="bg-[#201C38] border-green-500/20 text-green-400">
                        {userAccess.filter((a) => a.includes("Personal Room")).length} Personal Rooms
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex justify-end bg-[#1A1730] border-t border-[#342e54] px-6 py-4">
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="bg-[#262042] border-[#342e54] hover:bg-[#342e54] text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: userData ? 1.05 : 1 }} 
                whileTap={{ scale: userData ? 0.95 : 1 }}
              >
                <Button 
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  disabled={!userData || isUpdating}
                >
                  {isUpdating ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <UserCog className="h-4 w-4" />
                  }
                  <motion.span
                    animate={userData ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      repeat: userData ? Infinity : 0,
                      repeatDelay: 10
                    }}
                  >
                    Update User
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}