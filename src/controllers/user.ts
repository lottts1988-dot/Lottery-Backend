import { type Request, type Response, Router } from "express";
import { UserService } from "../services/user";
import { ReturnCode, ReturnMessage } from "../types/response";
import { verifyJwt } from "../utils/jwt";
import type { AddUser, RefreshToken, UpdateProfile } from "../types/user";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { isPermissionHave } from "../utils/common";

export class UserController {
  constructor(private userService: UserService) {}

  public router(): Router {
    const router = Router();

    router.post("/login", async (req: Request, res: Response) => {
      try {
        const { phone, password } = req.body;
        const result = await this.userService.login(phone, password);

        return res.status(200).json({
          returncode: ReturnCode.SUCCESS,
          message: ReturnMessage.SUCCESS,
          data: result,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          return res.status(200).json({
            returncode: ReturnCode.FAILED,
            message: err.message,
          });
        }
        return res.status(200).json({
          returncode: ReturnCode.FAILED,
          message: ReturnMessage.FAILED,
        });
      }
    });

    router.post("/adduser", verifyJwt, async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.UNAUTHORIZED,
          });
        }
        const data: AddUser = req.body;
        const result = await this.userService.addUser(data, req.user);
        return res.json({
          returncode: ReturnCode.SUCCESS,
          message: ReturnMessage.SUCCESS,
          data: result,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          return res.status(200).json({
            returncode: ReturnCode.FAILED,
            message: err.message,
          });
        }
        return res.status(200).json({
          returncode: ReturnCode.FAILED,
          message: ReturnMessage.FAILED,
        });
      }
    });

    router.post(
      "/updateprofile",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }
          const userId = req.user.id;
          const { fullname, password, newpassword } = req.body;

          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "User not found",
            });
          }

          if (!fullname || fullname.trim() === "") {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "Full name is required!",
            });
          }

          const updateData: Partial<UpdateProfile> = {
            fullname,
          };

          const oldPassword =
            typeof password === "string" && password.trim() !== ""
              ? password
              : null;

          const newPassword =
            typeof newpassword === "string" && newpassword.trim() !== ""
              ? newpassword
              : null;

          if (oldPassword && newPassword) {
            const isOldPasswordCorrect = await bcrypt.compare(
              password,
              user.password,
            );

            if (!isOldPasswordCorrect) {
              return res.json({
                returncode: ReturnCode.FAILED,
                message: "Old password is incorrect",
              });
            }

            if (newpassword.length < 8) {
              return res.json({
                returncode: ReturnCode.FAILED,
                message: "New password must be at least 8 characters",
              });
            }

            updateData.password = await bcrypt.hash(newpassword, 10);
          }

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
          });

          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: updatedUser,
          });
        } catch (error) {
          console.error(error);

          return res.json({
            returncode: ReturnCode.FAILED,
            message:
              error instanceof Error ? error.message : ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post(
      "/getallusers",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          const { name } = req.body;
          const result = await this.userService.getAllUsers(req.user, name);

          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: result,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: error.message,
            });
          }
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post("/refreshtoken", async (req: Request, res: Response) => {
      try {
        const data: RefreshToken = req.body;

        const result = await this.userService.refreshToken(data);

        return res.status(200).json({
          returncode: ReturnCode.SUCCESS,
          message: ReturnMessage.SUCCESS,
          data: result,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          return res.status(200).json({
            returncode: ReturnCode.FAILED,
            message: err.message,
          });
        }
        return res.status(200).json({
          returncode: ReturnCode.FAILED,
          message: ReturnMessage.FAILED,
        });
      }
    });

    router.post(
      "/resetpassword",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }
          const isRootAdmin = isPermissionHave(req.user.role);

          if (!isRootAdmin) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.PERMISSION_DENIED,
            });
          }

          const { userid, newpassword } = req.body;

          if (!userid || typeof userid !== "string") {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.IDREQUIRED,
            });
          }

          if (!newpassword || typeof newpassword !== "string") {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "New password is required!",
            });
          }

          const user = await prisma.user.findUnique({
            where: { id: userid },
          });

          if (!user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "User not found",
            });
          }

          const hashedPassword = await bcrypt.hash(newpassword, 10);

          const resetUser = await prisma.user.update({
            where: { id: userid },
            data: {
              password: hashedPassword,
            },
          });

          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: resetUser,
          });
        } catch (error) {
          console.error(error);
          return res.json({
            returncode: ReturnCode.FAILED,
            message:
              error instanceof Error ? error.message : ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post(
      "/updateprofile",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }
          const userId = req.user.id;
          const { fullname, password, newpassword } = req.body;

          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "User not found",
            });
          }

          if (!fullname || fullname.trim() === "") {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "Full name is required!",
            });
          }

          const updateData: Partial<UpdateProfile> = {
            fullname,
          };

          const oldPassword =
            typeof password === "string" && password.trim() !== ""
              ? password
              : null;

          const newPassword =
            typeof newpassword === "string" && newpassword.trim() !== ""
              ? newpassword
              : null;

          if (oldPassword && newPassword) {
            const isOldPasswordCorrect = await bcrypt.compare(
              password,
              user.password,
            );

            if (!isOldPasswordCorrect) {
              return res.json({
                returncode: ReturnCode.FAILED,
                message: "Old password is incorrect",
              });
            }

            if (newpassword.length < 8) {
              return res.json({
                returncode: ReturnCode.FAILED,
                message: "New password must be at least 8 characters",
              });
            }

            updateData.password = await bcrypt.hash(newpassword, 10);
          }

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
          });

          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: updatedUser,
          });
        } catch (error) {
          console.error(error);

          return res.json({
            returncode: ReturnCode.FAILED,
            message:
              error instanceof Error ? error.message : ReturnMessage.FAILED,
          });
        }
      },
    );

    return router;
  }
}
