// types/user.ts

export type Department = 
  | "Seecs" 
  | "Sada" 
  | "Iaec" 
  | "S3h" 
  | "Smme" 
  | "Rimms" 
  | "Ns" 
  | "Sns" 
  | "Nshs" 
  | "Igis" 
  | "Nice" 
  | "Scme" 
  | "Asap" 
  | "Nls";

export type Role = 
  | "Teacher" 
  | "Student" 
  | "Admin" 
  | "Lab Instructors" 
  | "Intern";

export interface User {
  _id?: string; // Convex ID
  _creationTime?: number;
  fullName: string;
  cmsId: string;
  email: string;
  dept: Department;
  role: Role;
  access: string[]; // Classes user has access to
}