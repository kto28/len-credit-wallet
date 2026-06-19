"use client";

import { AppProvider } from "@/lib/app-context";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
