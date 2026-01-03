import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userId = parseInt(session.user.id);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return NextResponse.json({
      checkedIn: !!attendance?.checkIn,
      checkInTime: attendance?.checkIn,
      checkOutTime: attendance?.checkOut,
    });
  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}