import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view employee attendance
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view employee attendance" },
        { status: 403 }
      );
    }

    const { employeeId } = await params;
    const userId = parseInt(employeeId);

    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        checkIn: true,
        checkOut: true,
        status: true,
      },
      orderBy: { date: "asc" },
    });

    // Transform to match UI expectations
    const result = attendanceRecords.map((record) => {
      let level = 0;

      if (record.checkIn && record.checkOut) {
        level = 3; // Full day
      } else if (record.checkIn) {
        level = 2; // Present
      } else if (record.status === "ABSENT") {
        level = 0; // Absent
      } else {
        level = 1; // Half day
      }

      return {
        date: record.date.toISOString().split("T")[0],
        level,
        label:
          level === 0
            ? "Absent"
            : level === 1
              ? "Half Day"
              : level === 2
                ? "Present"
                : "Full Day",
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
