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

    const userId = parseInt(session.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already checked in
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    let attendance;

    if (existingRecord) {
      attendance = await prisma.attendance.update({
        where: { id: existingRecord.id },
        data: {
          checkIn: new Date(),
        },
      });
    } else {
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