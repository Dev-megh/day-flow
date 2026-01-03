const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin
  await prisma.user.create({
    data: {
      employeeId: "EMP001",
      name: "Admin User",
      email: "admin@dayflow.com",
      password: hashedPassword,
      role: Role.ADMIN,
      payroll: {
        create: {
          salary: 100000,
        },
      },
    },
  });

  // Employees
  await prisma.user.createMany({
    data: [
      {
        employeeId: "EMP002",
        name: "Employee One",
        email: "emp1@dayflow.com",
        password: hashedPassword,
        role: Role.EMPLOYEE,
      },
      {
        employeeId: "EMP003",
        name: "Employee Two",
        email: "emp2@dayflow.com",
        password: hashedPassword,
        role: Role.EMPLOYEE,
      },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
