import type { AddUser } from "../types/user";

import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { Prisma, Role } from "../../prisma/generated/prisma/client";

export class UserRepo {
  public async findByPhone(value: string) {
    return prisma.user.findFirst({
      where: {
        isDeleted: false,
        phone: value,
      },
    });
  }

  public async addUser(data: AddUser) {
    const { phone, fullname, password, role } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await prisma.user.create({
        data: {
          phone,
          fullname,
          password: hashedPassword,
          role,
        },
      });
      return result;
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          err.code === "P2002" &&
          Array.isArray(err.meta?.target) &&
          (err.meta?.target as string[]).includes("phone")
        ) {
          throw new Error("Phone number already exists");
        }
      }
      throw err;
    }
  }

  public async getAllUsers(id: string, name: string) {
    const result = await prisma.user.findMany({
      where: {
        isDeleted: false,
        ...(id && { id: { not: id } }),
        ...(name && { fullname: { contains: name, mode: "insensitive" } }),
        role: { not: Role.ROOTADMIN },
      },
    });

    return result;
  }

  public async getUserByID(id: string) {
    const result = await prisma.user.findFirst({
      where: {
        isDeleted: false,
        id: id,
      },
    });

    return result;
  }
}
