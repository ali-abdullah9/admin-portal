"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Log the value of the environment variable
console.log('https://shiny-magpie-798.convex.cloud Convex URL:', process.env.NEXT_PUBLIC_CONVEX_URL);

const convex = new ConvexReactClient("https://shiny-magpie-798.convex.cloud");

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
