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

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: parseInt(session.user.id),
          date: today,
        },
      },
      update: {
        checkIn: new Date(),
        status: "PRESENT",
      },
      create: {
        userId: parseInt(session.user.id),
        date: today,
        checkIn: new Date(),
        status: "PRESENT",
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}