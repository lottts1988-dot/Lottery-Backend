import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ReturnCode, ReturnMessage } from "../types/response";
import type { UserJwtPayload } from "../types/jwt";

const JWT_SECRET = Bun.env.JWT_SECRET || "MY_SUPER_SECRET";
const JWT_EXPIRES_IN = "1d";

export function generateToken(payload: UserJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({
      returncode: ReturnCode.FAILED,
      message: ReturnMessage.AUTH_MISS,
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.json({
      returncode: ReturnCode.FAILED,
      message: ReturnMessage.AUTH_MALFORMED,
    });
  }

  const token = parts[1];
  if (!token) {
    return res.json({
      returncode: ReturnCode.FAILED,
      message: ReturnMessage.TOKEN_MISS,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
        return res.json({
          returncode: ReturnCode.TOKEN_EXPIRE,
          message: ReturnMessage.TOKEN_EXPIRE,
        });
      } else {
        return res.json({
          returncode: ReturnCode.FAILED,
          message: ReturnMessage.INVTOKEN,
        });
      }
    }
  }
}
