import type { Role } from "../../prisma/generated/prisma/enums";

export interface AddUser {
  id: string;
  phone: string;
  fullname: string;
  password: string;
  role: Role;
}

export interface UpdateProfile {
  fullname: string;
  password: string;
}

export interface RefreshToken {
  id: string;
  token: string;
}
