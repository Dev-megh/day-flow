"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const { data: session } = useSession();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAttendanceStatus = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/attendance/status");
      const data = await response.json();
      
      if (data.checkedIn) {
        setCheckedIn(true);
        setCheckInTime(new Date(data.checkInTime));
      } else {
        setCheckedIn(false);
        setCheckInTime(null);
      }
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAttendanceStatus();
  }, [session?.user?.id, fetchAttendanceStatus]);

  const checkIn = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        await fetchAttendanceStatus();
      }
    } catch (error) {
      console.error("Check-in failed:", error);
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

      if (response.ok) {
        await fetchAttendanceStatus();
      }
    } catch (error) {
      console.error("Check-out failed:", error);
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{ checkedIn, checkInTime, loading, checkIn, checkOut }}
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