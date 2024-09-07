"use client";

// Jotai imports
import { Provider } from "jotai";

// Define wrapper to allow children of the wrapper to access Jotai atoms
export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Provider>{children}</Provider>;
}
