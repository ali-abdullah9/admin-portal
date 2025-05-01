"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formSchema } from "@/lib/formSchema"
import { api } from "../../convex/_generated/api"

// Pre-generate access options (10 classes, 5 labs, 10 rooms per department)
const departments = [
  "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms",
  "Ns", "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
]

const accessOptions = departments.flatMap(dept => {
  const classes = Array.from({ length: 10 }, (_, i) => `${dept} Class ${i + 1}`)
  const labs = Array.from({ length: 5 }, (_, i) => `${dept} Lab ${i + 1}`)
  const rooms = Array.from({ length: 10 }, (_, i) => `${dept} Room ${i + 1}`)
  return [...classes, ...labs, ...rooms]
})

export function AddUserForm() {
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

  // Submit handler
  // Frontend part - AddUserForm.tsx
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
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Updated background color and card */}
      <Card className="p-8 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CMS ID & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cmsId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CMS ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 413814" {...field} />
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
                      <Select {...field}>
                        <SelectTrigger className="input dark:bg-gray-900 dark:border-gray-700">
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

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="input dark:bg-gray-900 dark:border-gray-700">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Lab Instructors">Lab Instructors</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Access (Multi-Select) */}
            <FormField
              control={form.control}
              name="access"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access (Hold Ctrl/Cmd to select multiple)</FormLabel>
                  <FormControl>
                    <select
                      multiple
                      className="input dark:bg-gray-900 dark:border-gray-700 h-48"
                      value={field.value}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                        field.onChange(selected)
                      }}
                    >
                      {accessOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-white">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
