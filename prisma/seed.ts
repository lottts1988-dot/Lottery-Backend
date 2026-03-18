import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

interface user {
  phone: string;
  fullname: string;
  password: string;
  role: Role;
}

const userData = [
  {
    phone: "09123456789",
    fullname: "Root Admin",
    password: "password",
    role: Role.ROOTADMIN,
  },
  {
    phone: "09987654321",
    fullname: "Admin",
    password: "password",
    role: Role.ADMIN,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL,
    typeof process.env.DATABASE_URL,
  );
  await prisma.user.deleteMany();
  const users: user[] = [];
  for (const u of userData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword,
      },
    });
    users.push(user);
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
