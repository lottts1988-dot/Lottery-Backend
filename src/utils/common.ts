import { Role } from "../../prisma/generated/prisma/client";
import { ReturnMessage } from "../types/response";

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
