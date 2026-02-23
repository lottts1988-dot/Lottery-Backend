import { Role } from "../../prisma/generated/prisma/client";
import { ReturnCode, ReturnMessage } from "../types/response";

import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
  const key = req.header("x-api-key") || "";
  const validKey = process.env.X_API_KEY || "";

  const isValid =
    key.length === validKey.length &&
    crypto.timingSafeEqual(Buffer.from(key), Buffer.from(validKey));

  if (!isValid) {
    return res
      .status(200)
      .json({
        returnCode: ReturnCode.FAILED,
        message: ReturnMessage.UNAUTHORIZED,
      });
  }

  next();
}

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
  const baseYear = 2026;
  const baseMonth = 1;
  const baseValue = 33;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthDiff = (currentYear - baseYear) * 12 + (currentMonth - baseMonth);

  const value = baseValue + monthDiff;

  return String(value);
}

export function generateInvoice() {
  const now = new Date();

  const getRandomId = (min = 0, max = 500000) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(6, "0");
  };

  const day = now.getUTCDate();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  return `${day}${month}${year}${getRandomId()}`;
}
