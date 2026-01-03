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

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "No check-in found for today" },
        { status: 400 }
      );
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json(
      { error: error.message || "Check-out failed" },
      { status: 500 }
    );
  }
}