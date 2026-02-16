
import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../../prisma/generated/prisma/client";

export interface UserJwtPayload extends JwtPayload {
  id: string;
  phone: string;
  fullname: string;
  password: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserJwtPayload;
  }
}

export {};
