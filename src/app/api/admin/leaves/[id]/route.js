import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    const leave = await prisma.leave.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });

    return NextResponse.json(leave);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}