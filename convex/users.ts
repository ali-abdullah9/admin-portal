// convex/functions/addUser.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server"; // Import mutation from Convex
import { z } from "zod";

// Zod schema for user data validation (same as client-side validation)
const userSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  cmsId: z.string().min(1, { message: "CMS ID is required." }),
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
    z.literal("Nls")
  ]),
  role: z.union([
    z.literal("Teacher"),
    z.literal("Student"),
    z.literal("Admin"),
    z.literal("Lab Instructors"),
    z.literal("Intern")
  ]),
  access: z.array(z.string()),
});

// Create a new user in the database
export const addUser = mutation({
  args: {
    fullName: v.string(),
    cmsId: v.string(),
    email: v.string(),
    dept: v.union(
      v.literal("Seecs"),
      v.literal("Sada"),
      v.literal("Iaec"),
      v.literal("S3h"),
      v.literal("Smme"),
      v.literal("Rimms"),
      v.literal("Ns"),
      v.literal("Sns"),
      v.literal("Nshs"),
      v.literal("Igis"),
      v.literal("Nice"),
      v.literal("Scme"),
      v.literal("Asap"),
      v.literal("Nls")
    ),
    role: v.union(
      v.literal("Teacher"),
      v.literal("Student"),
      v.literal("Admin"),
      v.literal("Lab Instructors"),
      v.literal("Intern")
    ),
    access: v.array(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Validate the incoming data using Zod (server-side validation)
      userSchema.parse(args); // This will throw if validation fails
    } catch (err: unknown) {
      // Type the error as an instance of Error to safely access the message
      if (err instanceof Error) {
        throw new Error(`Validation failed: ${err.message}`);
      }
      throw new Error("An unknown error occurred.");
    }

    // Check if a user with the same CMS ID or email already exists
    const existingUser = await ctx.db
      .query("users")
      .filter(
        (q) =>
         q.and(q.eq(q.field("cmsId"), args.cmsId),(q.eq(q.field("email"), args.email))) // Correct syntax for filtering
      )
      .first();

    if (existingUser) {
      throw new Error("A user with the same CMS ID or email already exists.");
    }

    // Insert new user into the database
    const newUserId = await ctx.db.insert("users", {
      fullName: args.fullName,
      cmsId: args.cmsId,
      email: args.email,
      dept: args.dept,
      role: args.role,
      access: args.access,
    });

    return newUserId; // Return the new user's ID
  },
});
