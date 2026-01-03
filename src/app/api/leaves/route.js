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

    const leaves = await prisma.leave.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { from: "desc" },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, from, to, reason } = await request.json();

    const leave = await prisma.leave.create({
      data: {
        userId: parseInt(session.user.id),
        type,
        from: new Date(from),
        to: new Date(to),
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}