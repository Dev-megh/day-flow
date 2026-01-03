import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Payroll ID is required" }), { status: 400 });
    }

    const payroll = await prisma.payroll.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, employeeId: true, name: true, email: true },
        },
      },
    });

    if (!payroll) {
      return new Response(JSON.stringify({ error: "Payroll not found" }), { status: 404 });
    }

    // Check access: employee can only view their own, admin can view all
    if (session.user.role !== "ADMIN" && payroll.userId !== parseInt(session.user.id)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    return new Response(JSON.stringify(payroll), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch payroll:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch payroll" }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Only admins can update payroll" }), {
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Payroll ID is required" }), { status: 400 });
    }

    const { baseSalary, deductions, bonuses, status } = await req.json();

    const payroll = await prisma.payroll.findUnique({
      where: { id: parseInt(id) },
    });

    if (!payroll) {
      return new Response(JSON.stringify({ error: "Payroll not found" }), { status: 404 });
    }

    // Recalculate salary if baseSalary changed
    let calculatedSalary = payroll.calculatedSalary;
    if (baseSalary) {
      calculatedSalary = (payroll.presentDays / payroll.workingDays) * baseSalary;
    }

    const totalSalary =
      calculatedSalary +
      (bonuses ?? payroll.bonuses) -
      (deductions ?? payroll.deductions);

    const updatedPayroll = await prisma.payroll.update({
      where: { id: parseInt(id) },
      data: {
        baseSalary: baseSalary ?? payroll.baseSalary,
        deductions: deductions ?? payroll.deductions,
        bonuses: bonuses ?? payroll.bonuses,
        calculatedSalary,
        totalSalary,
        status: status ?? payroll.status,
      },
      include: {
        user: {
          select: { id: true, employeeId: true, name: true },
        },
      },
    });

    return new Response(JSON.stringify(updatedPayroll), { status: 200 });
  } catch (error) {
    console.error("Failed to update payroll:", error);
    return new Response(JSON.stringify({ error: "Failed to update payroll" }), { status: 500 });
  }
}
