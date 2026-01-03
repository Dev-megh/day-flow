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

    // Only admins can view all employees
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view employee attendance" },
        { status: 403 }
      );
    }

    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        employeeId: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Fetch employees error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
