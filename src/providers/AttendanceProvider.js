"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const { data: session } = useSession();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAttendanceStatus = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/attendance/status");
      if (!response.ok) throw new Error("Failed to fetch status");

      const data = await response.json();

      setCheckedIn(data.checkedIn);
      setCheckInTime(data.checkInTime ? new Date(data.checkInTime) : null);
      setCheckOutTime(data.checkOutTime ? new Date(data.checkOutTime) : null);
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
      setCheckedIn(false);
      setCheckInTime(null);
      setCheckOutTime(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAttendanceStatus();

    // Poll every 30 seconds to check status
    const interval = setInterval(fetchAttendanceStatus, 30000);
    return () => clearInterval(interval);
  }, [session?.user?.id, fetchAttendanceStatus]);

  const checkIn = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Check-in failed");
      }

      const data = await response.json();
      setCheckedIn(true);
      setCheckInTime(new Date(data.checkIn));
      return { success: true };
    } catch (error) {
      console.error("Check-in failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Check-out failed");
      }

      const data = await response.json();
      setCheckedIn(false);
      setCheckOutTime(new Date(data.checkOut));
      return { success: true };
    } catch (error) {
      console.error("Check-out failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        checkedIn,
        checkInTime,
        checkOutTime,
        loading,
        checkIn,
        checkOut,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within AttendanceProvider");
  }
  return context;
}