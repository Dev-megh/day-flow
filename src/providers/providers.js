"use client";

import { SessionProvider } from "next-auth/react";
import { AttendanceProvider } from "./AttendanceProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AttendanceProvider>
        {children}
      </AttendanceProvider>
    </SessionProvider>
  );
}