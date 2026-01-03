import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leave = await prisma.leave.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    // Check authorization
    const isOwner = leave.userId === parseInt(session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Fetch leave error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can approve/reject
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can approve/reject leaves" },
        { status: 403 }
      );
    }

    const { status, approverComment } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const leave = await prisma.leave.update({
      where: { id: parseInt(params.id) },
      data: {
        status,
        approverComment,
        approvedAt: new Date(),
        approverId: parseInt(session.user.id),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, employeeId: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return NextResponse.json(leave);
  } catch (error) {
    console.error("Update leave error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}