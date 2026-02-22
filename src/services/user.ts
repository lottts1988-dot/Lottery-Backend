import { UserRepo } from "../repositories/user";
import  type { UserJwtPayload } from "../types/jwt";
import { ReturnMessage } from "../types/response";
import type { AddUser, RefreshToken } from "../types/user";
import { generateToken } from "../utils/jwt";
import { showPermissionErr } from "../utils/common";
import bcrypt from "bcryptjs";
import jwt_decode from "jwt-decode";

export class UserService {
  constructor(private userRepo: UserRepo) {
    this.userRepo = userRepo;
  }
  public async login(phone: string, password: string) {
    const user = await this.userRepo.findByPhone(phone);

    if (!user) {
      throw new Error("Invalid Phone Number");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Password!");
    }

    const payload = {
      id: user.id,
      phone: user.phone,
      fullname: user.fullname,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user,
    };
  }

  public async addUser(data: AddUser, reqUser: UserJwtPayload) {
    showPermissionErr(reqUser.role);
    const adduser = await this.userRepo.addUser(data);
    return adduser;
  }

  public async getAllUsers(reqUser: UserJwtPayload, name: string) {
    showPermissionErr(reqUser.role);
    const getallusers = await this.userRepo.getAllUsers(reqUser.id, name);
    return getallusers;
  }

  public async refreshToken(data: RefreshToken) {
    const { id, token } = data;

    try {
      const decodedToken = <UserJwtPayload>jwt_decode(token);
      const useridfromtoken = decodedToken.id;
      const exp = decodedToken.exp ?? 0.0;
      if (id != useridfromtoken) {
        throw new Error(ReturnMessage.UNAUTHORIZED);
      }

      const user = await this.userRepo.getUserByID(id);
      if (!user) {
        throw new Error("User Not Registered");
      }

      if (Date.now() >= exp * 1000) {
        const payload = {
          id: user.id,
          phone: user.phone,
          fullname: user.fullname,
          role: user.role,
        };

        const token = generateToken(payload);
        return {
          user,
          token,
        };
      } else {
        return { user, token };
      }
    } catch {
      throw new Error(ReturnMessage.INVTOKEN);
    }
  }
}
