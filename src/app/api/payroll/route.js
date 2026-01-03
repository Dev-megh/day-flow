import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    if (session.user.role === "ADMIN") {
      const payroll = await prisma.payroll.findMany({
        include: {
          user: {
            select: { id: true, employeeId: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return new Response(JSON.stringify(payroll), { status: 200 });
    } else {
      const payroll = await prisma.payroll.findMany({
        where: { userId: parseInt(session.user.id) },
        orderBy: { createdAt: "desc" },
      });
      return new Response(JSON.stringify(payroll), { status: 200 });
    }
  } catch (error) {
    console.error("Failed to fetch payroll:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch payroll" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Only admins can create payroll" }), {
        status: 403,
      });
    }

    const { userId, baseSalary, deductions, bonuses, paymentMonth, paymentYear } =
      await req.json();

    if (!userId || !baseSalary || !paymentMonth || !paymentYear) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: userId, baseSalary, paymentMonth, paymentYear",
        }),
        { status: 400 }
      );
    }

    const year = paymentYear;
    const month = paymentMonth;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    let workingDays = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        workingDays++;
      }
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const presentDays = attendances.filter((a) => a.checkIn).length;
    const absentDays = workingDays - presentDays;

    // Calculate salary: (presentDays / workingDays) * baseSalary + bonuses - deductions
    const calculatedSalary = (presentDays / workingDays) * baseSalary;
    const totalSalary = calculatedSalary + (bonuses || 0) - (deductions || 0);

    // Check if payroll entry already exists
    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        userId_paymentMonth_paymentYear: {
          userId: userId,
          paymentMonth: month,
          paymentYear: year,
        },
      },
    });

    if (existingPayroll) {
      return new Response(
        JSON.stringify({ error: "Payroll already exists for this month and year" }),
        { status: 400 }
      );
    }

    // Create payroll entry
    const payroll = await prisma.payroll.create({
      data: {
        userId,
        baseSalary,
        deductions: deductions || 0,
        bonuses: bonuses || 0,
        paymentMonth: month,
        paymentYear: year,
        workingDays,
        presentDays,
        absentDays,
        calculatedSalary,
        totalSalary,
      },
      include: {
        user: {
          select: { id: true, employeeId: true, name: true },
        },
      },
    });

    return new Response(JSON.stringify(payroll), { status: 201 });
  } catch (error) {
    console.error("Failed to create payroll:", error);
    return new Response(JSON.stringify({ error: "Failed to create payroll" }), { status: 500 });
  }
}
