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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userId = parseInt(session.user.id);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if record exists for today
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    let attendance;

    if (existingRecord) {
      // Update existing record
      attendance = await prisma.attendance.update({
        where: { id: existingRecord.id },
        data: {
          checkIn: new Date(),
          status: "PRESENT",
        },
      });
    } else {
      // Create new record
      attendance = await prisma.attendance.create({
        data: {
          userId,
          date: today,
          checkIn: new Date(),
          status: "PRESENT",
        },
      });
    }

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: error.message || "Check-in failed" },
      { status: 500 }
    );
  }
}