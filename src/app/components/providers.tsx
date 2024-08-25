"use client";

import { Provider } from "jotai";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Provider>{children}</Provider>;
}
