"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formSchema } from "@/lib/formSchema";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Building,
  BookOpen,
  Beaker,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

// Pre-generate access options (15 classes, 5 labs, 1 staff room, 10 personal rooms per department)
const departments = [
  "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms",
  "Ns", "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
];

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
  };
  
  departments.forEach(dept => {
    // Create 15 classes for each department
    accessCategories.classes[dept] = Array.from({ length: 15 }, (_, i) => `${dept} Class ${i + 1}`);
    
    // Add these classes to the allClasses array
    accessCategories.allClasses.push(...accessCategories.classes[dept]);
    
    // Create 5 labs for each department
    accessCategories.labs[dept] = Array.from({ length: 5 }, (_, i) => `${dept} Lab ${i + 1}`);
    
    // Create 1 staff room for each department
    accessCategories.staffRooms[dept] = [`${dept} Staff Room`];
    
    // Create 10 personal rooms for each department
    accessCategories.personalRooms[dept] = Array.from({ length: 10 }, (_, i) => `${dept} Personal Room ${i + 1}`);
  });
  
  return accessCategories;
}

// Success animation component
const SuccessAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#15132F] rounded-xl p-10 border border-[#342e54] text-white shadow-xl flex flex-col items-center"
        initial={{ scale: 0.5, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, 0] }}
          transition={{
            scale: { delay: 0.2, type: "spring", damping: 8 },
            rotate: { delay: 0.4, duration: 0.5, ease: "easeInOut" },
          }}
        >
          <div className="relative">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: 2,
                repeatType: "reverse",
              }}
            >
              <Sparkles className="h-20 w-20 text-yellow-400 opacity-70" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h3
          className="text-xl font-medium mt-4 mb-2 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          User Added Successfully!
        </motion.h3>
      </motion.div>

      {/* Confetti elements */}
      {Array.from({ length: 40 }).map((_, index) => {
        const size = Math.random() * 8 + 5;
        const colors = [
          "bg-blue-500",
          "bg-green-500",
          "bg-yellow-400",
          "bg-purple-500",
          "bg-pink-500",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isSquare = Math.random() > 0.5;

        return (
          <motion.div
            key={index}
            className={`absolute ${color} ${isSquare ? "rounded-sm" : "rounded-full"}`}
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: (Math.random() - 0.5) * window.innerWidth * 0.7,
              y: (Math.random() - 0.5) * window.innerHeight * 0.7,
              opacity: [0, 1, 0],
              rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{
              duration: 2,
              ease: ["easeOut", "easeIn"],
              delay: Math.random() * 0.2,
            }}
          />
        );
      })}
    </motion.div>
  );
};

export function AddUserForm() {
  const [selectedDept, setSelectedDept] = useState("Seecs");
  const [selectedRole, setSelectedRole] = useState("Student");
  const accessCategories = generateAccessOptions();
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [formStage, setFormStage] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
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
  });

  const addUserMutation = useMutation(api.users.addUser);

  // Filter access options based on department and role
  useEffect(() => {
    const options: string[] = [];
    
    // Add ALL classes from ALL departments for all roles
    options.push(...accessCategories.allClasses);
    
    // Add labs only from user's department
    if (accessCategories.labs[selectedDept]) {
      options.push(...accessCategories.labs[selectedDept]);
    }
    
    // Add staff room from user's department
    if (accessCategories.staffRooms[selectedDept]) {
      options.push(...accessCategories.staffRooms[selectedDept]);
    }
    
    // Add personal rooms only for Teacher and Admin roles from their department
    if ((selectedRole === "Teacher" || selectedRole === "Admin") && accessCategories.personalRooms[selectedDept]) {
      options.push(...accessCategories.personalRooms[selectedDept]);
    }
    
    setFilteredOptions(options);
    
    // Reset access selection when role or department changes
    // Only reset if form is available and not during initial render
    if (form) {
      form.setValue("access", []);
    }
  }, [selectedDept, selectedRole]);

  // Watch for role and department changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.dept && value.dept !== selectedDept) {
        setSelectedDept(value.dept);
      }
      if (value.role && value.role !== selectedRole) {
        setSelectedRole(value.role);
      }
      
      // Update form progress for animations
      let stage = 0;
      if (value.fullName && value.email) stage = 1;
      if (stage === 1 && value.cmsId && value.dept) stage = 2;
      if (stage === 2 && value.role) stage = 3;
      setFormStage(stage);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Call the addUser mutation
      await addUserMutation(values);
      
      // Show success animation
      setShowSuccessAnimation(true);
      
      // Success toast
      toast.success("User added successfully!");
    } catch (err: unknown) {
      // Type the error as an instance of Error to safely access the message
      if (err instanceof Error) {
        toast.error(err.message || "Failed to add user.");
      } else {
        toast.error("An unknown error occurred.");
      }
      
      console.error("Failed to add user:", err);
    }
  }
  
  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    form.reset();
    setFormStage(0);
  };

  return (
    <div className="w-full">
      {/* Success animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <SuccessAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
      
      <Form {...form}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h3 className="text-xl font-medium text-white mb-4">Personal Information</h3>
              <Separator className="mb-6 bg-[#22203C]" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter full name" 
                            className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500 transition-colors duration-200" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500 transition-colors duration-200" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Identification Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: formStage >= 1 ? 1 : 0.7,
              }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className="text-xl font-medium text-white mb-4">Identification</h3>
              <Separator className="mb-6 bg-[#22203C]" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: formStage >= 1 ? 1 : 0.7 
                  }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="cmsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">CMS ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 413814" 
                            className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500 transition-colors duration-200" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: formStage >= 1 ? 1 : 0.7 
                  }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="dept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Department</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedDept(value);
                            }}
                          >
                            <SelectTrigger className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500 transition-colors duration-200">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1730] border-[#262042] text-white">
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
                </motion.div>
              </div>
            </motion.div>
            
            {/* Role & Access Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: formStage >= 2 ? 1 : 0.7 
              }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <h3 className="text-xl font-medium text-white mb-4">Permissions & Access</h3>
              <Separator className="mb-6 bg-[#22203C]" />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-white">Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedRole(value);
                        }}
                      >
                        <SelectTrigger className="bg-[#15132F] border-[#262042] text-white focus:border-blue-500 transition-colors duration-200">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1730] border-[#262042] text-white">
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Lab Instructors">Lab Instructor</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-gray-400">
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
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                      <FormLabel className="text-white">Access Privileges</FormLabel>
                      <div className="flex gap-2 flex-wrap">
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
                          {(selectedRole === "Teacher" || selectedRole === "Admin") && (
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
                    <FormControl>
                      <motion.div
                        initial={{ height: 100, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: formStage >= 3 ? 1 : 0.7 
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <select
                          multiple
                          className="w-full h-64 rounded-md border border-[#262042] bg-[#15132F] px-3 py-2 text-sm text-white transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={field.value}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                            field.onChange(selected);
                          }}
                        >
                          {filteredOptions.map((opt) => (
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
                    </FormControl>
                    <FormDescription className="text-gray-400 mt-2">
                      Hold Ctrl/Cmd to select multiple locations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div 
              className="flex justify-end gap-3 mt-8 border-t border-[#22203C] pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                  className="bg-[#262042] border-[#342e54] hover:bg-[#342e54] text-white transition-colors duration-200"
                >
                  Reset
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="submit"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <motion.span
                    animate={{ scale: formStage >= 3 ? [1, 1.1, 1] : 1 }}
                    transition={{ 
                      repeat: formStage >= 3 ? Infinity : 0, 
                      repeatDelay: 3,
                      duration: 0.5 
                    }}
                  >
                    Add User
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Selected access count indicator */}
            <AnimatePresence>
              {form.watch("access").length > 0 && (
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
                      {form.watch("access").length} selected
                    </Badge>
                  </div>

                  {/* Access type counts */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-[#201C38] border-blue-500/20 text-blue-400">
                      {form.watch("access").filter((a) => a.includes("Class")).length} Classes
                    </Badge>
                    <Badge variant="outline" className="bg-[#201C38] border-amber-500/20 text-amber-400">
                      {form.watch("access").filter((a) => a.includes("Lab")).length} Labs
                    </Badge>
                    <Badge variant="outline" className="bg-[#201C38] border-purple-500/20 text-purple-400">
                      {form.watch("access").filter((a) => a.includes("Staff Room")).length} Staff Rooms
                    </Badge>
                    <Badge variant="outline" className="bg-[#201C38] border-green-500/20 text-green-400">
                      {form.watch("access").filter((a) => a.includes("Personal Room")).length} Personal Rooms
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </Form>
    </div>
  );
}