import { Role } from "../../prisma/generated/prisma/client";
import { ReturnMessage } from "../types/response";
import { prisma } from "./prisma";

const ALLOWED_ROLES: Role[] = [Role.ROOTADMIN];

export function showPermissionErr(role: Role): void {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error(ReturnMessage.PERMISSION_DENIED);
  }
}

export function isPermissionHave(role: Role): boolean {
  if (ALLOWED_ROLES.includes(role)) {
    return true;
  } else {
    return false;
  }
}

export function getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getNextMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1);
  const nextmonth = String(Number(month) + 1).padStart(2, "0");
  return `${year}-${nextmonth}`;
}

export async function getTime(): Promise<string> {
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { date: "desc" },
  });

  const lastNumber = lastTicket?.time ?? 0;

  const lastDate = lastTicket ? new Date(lastTicket.date) : null;

  const lastMonth = lastDate ? lastDate.getMonth() : -1;
  const currentMonth = new Date().getMonth();

  let thisMonthNumber = lastNumber;

  if (currentMonth !== lastMonth) {
    thisMonthNumber = Number(lastNumber) + 1;
  }
  return String(thisMonthNumber);
}
