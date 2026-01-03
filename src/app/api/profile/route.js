import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch profile" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { name, phone, address } = await req.json();

    if (!name || !phone || !address) {
      return new Response(
        JSON.stringify({ error: "Name, phone, and address are required" }),
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
  }
}
