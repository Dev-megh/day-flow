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

    // Only admins can view all leaves
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view all leaves" },
        { status: 403 }
      );
    }

    const leaves = await prisma.leave.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error("Fetch all leaves error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}