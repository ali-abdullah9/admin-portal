// formSchema.ts
"use client"

import { z } from "zod"

// Zod schema for user data validation
export const formSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required." }),
    email: z.string().email({ message: "Invalid email format." }),
    cmsId: z.string().min(6, { message: "CMS ID is required." }),
    dept: z.union([
      z.literal("Seecs"),
      z.literal("Sada"),
      z.literal("Iaec"),
      z.literal("S3h"),
      z.literal("Smme"),
      z.literal("Rimms"),
      z.literal("Ns"),
      z.literal("Sns"),
      z.literal("Nshs"),
      z.literal("Igis"),
      z.literal("Nice"),
      z.literal("Scme"),
      z.literal("Asap"),
      z.literal("Nls")  ]),
    role: z.union([
      z.literal("Teacher"),
      z.literal("Student"),
      z.literal("Admin"),
      z.literal("Lab Instructors"),
      z.literal("Intern")
    ]),
    access: z.array(z.string()),
  })