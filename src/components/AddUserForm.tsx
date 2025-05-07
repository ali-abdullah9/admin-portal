"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formSchema } from "@/lib/formSchema"
import { api } from "../../convex/_generated/api"
import { useState, useEffect } from "react"
import { UserPlus, Building, BookOpen, Beaker, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Pre-generate access options (15 classes, 5 labs, 1 staff room, 10 personal rooms per department)
const departments = [
  "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms",
  "Ns", "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
]

// Categorized access options
interface AccessCategories {
  classes: Record<string, string[]>;
  labs: Record<string, string[]>;
  staffRooms: Record<string, string[]>;
  personalRooms: Record<string, string[]>;
  allClasses: string[];
}

const generateAccessOptions = (): AccessCategories => {
  const accessCategories: AccessCategories = {
    classes: {},
    labs: {},
    staffRooms: {},
    personalRooms: {},
    allClasses: []
  }
  
  departments.forEach(dept => {
    // Create 15 classes for each department
    accessCategories.classes[dept] = Array.from({ length: 15 }, (_, i) => `${dept} Class ${i + 1}`)
    
    // Add these classes to the allClasses array
    accessCategories.allClasses.push(...accessCategories.classes[dept])
    
    // Create 5 labs for each department
    accessCategories.labs[dept] = Array.from({ length: 5 }, (_, i) => `${dept} Lab ${i + 1}`)
    
    // Create 1 staff room for each department
    accessCategories.staffRooms[dept] = [`${dept} Staff Room`]
    
    // Create 10 personal rooms for each department
    accessCategories.personalRooms[dept] = Array.from({ length: 10 }, (_, i) => `${dept} Personal Room ${i + 1}`)
  })
  
  return accessCategories
}

export function AddUserForm() {
  const [selectedDept, setSelectedDept] = useState("Seecs")
  const [selectedRole, setSelectedRole] = useState("Student")
  const accessCategories = generateAccessOptions()
  const [filteredOptions, setFilteredOptions] = useState<string[]>([])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      cmsId: "",
      dept: "Seecs",
      role: "Student",
      access: [],
    },
  })

  const addUserMutation = useMutation(api.users.addUser)

  // Filter access options based on department and role
  useEffect(() => {
    const options: string[] = []
    
    // Add ALL classes from ALL departments for all roles
    options.push(...accessCategories.allClasses)
    
    // Add labs only from user's department
    if (accessCategories.labs[selectedDept]) {
      options.push(...accessCategories.labs[selectedDept])
    }
    
    // Add staff room from user's department
    if (accessCategories.staffRooms[selectedDept]) {
      options.push(...accessCategories.staffRooms[selectedDept])
    }
    
    // Add personal rooms only for Teacher and Admin roles from their department
    if ((selectedRole === "Teacher" || selectedRole === "Admin") && accessCategories.personalRooms[selectedDept]) {
      options.push(...accessCategories.personalRooms[selectedDept])
    }
    
    setFilteredOptions(options)
    
    // Reset access selection when role or department changes
    // Only reset if form is available and not during initial render
    if (form) {
      form.setValue("access", [])
    }
  }, [selectedDept, selectedRole])

  // Watch for role and department changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.dept && value.dept !== selectedDept) {
        setSelectedDept(value.dept)
      }
      if (value.role && value.role !== selectedRole) {
        setSelectedRole(value.role)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [form])

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Call the addUser mutation
      await addUserMutation(values)
      
      // Success toast
      toast.success("User added successfully!")
      form.reset()
    } catch (err: unknown) {
      // Type the error as an instance of Error to safely access the message
      if (err instanceof Error) {
        toast.error(err.message || "Failed to add user.")
      } else {
        toast.error("An unknown error occurred.")
      }
      
      console.error("Failed to add user:", err)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Add New User</CardTitle>
              <CardDescription>Create a new user and assign access privileges</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-base font-medium flex items-center gap-2 mb-4 text-foreground">
                  <span>Personal Information</span>
                  <Separator className="flex-1 ml-2" />
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Identification Section */}
              <div>
                <h3 className="text-base font-medium flex items-center gap-2 mb-4 text-foreground">
                  <span>Identification</span>
                  <Separator className="flex-1 ml-2" />
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cmsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CMS ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 413814" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedDept(value)
                            }}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dep) => (
                                <SelectItem key={dep} value={dep}>
                                  {dep}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Role & Access Section */}
              <div>
                <h3 className="text-base font-medium flex items-center gap-2 mb-4 text-foreground">
                  <span>Permissions & Access</span>
                  <Separator className="flex-1 ml-2" />
                </h3>
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedRole(value)
                          }}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Lab Instructors">Lab Instructor</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        {selectedRole === "Student" || selectedRole === "Intern" || selectedRole === "Lab Instructors" ? 
                          "Note: Only teachers and admins can access personal rooms" : ""}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="access"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Access Privileges</FormLabel>
                        <div className="flex gap-2">
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
                          {(selectedRole === "Teacher" || selectedRole === "Admin") && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>Personal Rooms</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <FormControl>
                        <select
                          multiple
                          className="w-full h-64 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={field.value}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                            field.onChange(selected)
                          }}
                        >
                          {filteredOptions.map((opt) => (
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
                      </FormControl>
                      <FormDescription>
                        Hold Ctrl/Cmd to select multiple locations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-end bg-muted/30 border-t px-6 py-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              className="gap-2 dark: text-white"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}