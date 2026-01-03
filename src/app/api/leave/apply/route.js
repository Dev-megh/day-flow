import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leaveType, startDate, endDate, reason, isHalfDay } =
      await request.json();

    const userId = parseInt(session.user.id);

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json(
        { error: "Start date must be before end date" },
        { status: 400 }
      );
    }

    // Calculate number of days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = isHalfDay ? 0.5 : diffDays;

    const leave = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        totalDays,
        isHalfDay,
        status: "PENDING",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error("Leave apply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to apply leave" },
      { status: 500 }
    );
  }
}