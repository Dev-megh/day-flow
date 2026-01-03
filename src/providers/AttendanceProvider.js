"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const { data: session } = useSession();
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current attendance status on mount
  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchAttendanceStatus = async () => {
      try {
        const response = await fetch("/api/attendance/status");
        const data = await response.json();
        
        if (data.checkedIn) {
          setCheckedIn(true);
          setCheckInTime(new Date(data.checkInTime));
        }
      } catch (error) {
        console.error("Failed to fetch attendance status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, [session?.user?.id]);

  const checkIn = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });

      if (response.ok) {
        setCheckedIn(true);
        setCheckInTime(new Date());
      }
    } catch (error) {
      console.error("Check-in failed:", error);
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
        body: JSON.stringify({ date: new Date().toISOString() }),
      });

      if (response.ok) {
        setCheckedIn(false);
        setCheckInTime(null);
      }
    } catch (error) {
      console.error("Check-out failed:", error);
    } finally {
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