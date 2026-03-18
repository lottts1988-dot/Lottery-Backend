import { Router, type Request, type Response } from "express";
import type { UploadService } from "../services/upload";
import { upload } from "../utils/upload";
import { verifyJwt } from "../utils/jwt";
import { ReturnCode, ReturnMessage } from "../types/response";
import { apiKeyGuard } from "../utils/common";

export class UploadController {
  constructor(private uploadService: UploadService) {}

  router(): Router {
    const router = Router();

    router.post(
      "/admin/uploads",
      verifyJwt,
      upload.single("image"),
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          if (!req.query.folder) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "Folder is required!",
            });
          }
          const folder = req.query.folder;

          if (typeof folder !== "string") {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "Invalid folder parameter",
            });
          }

          const file = req.file;
          if (!file) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "No file uploaded",
            });
          }

          const result = await this.uploadService.uploadAdminImages(
            file,
            folder,
          );
          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: result,
          });
        } catch (e: unknown) {
          if (e instanceof Error) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: e.message,
            });
          }
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post(
      "/uploads",
      apiKeyGuard,
      upload.single("image"),
      async (req: Request, res: Response) => {
        try {
          const file = req.file;

          if (!file) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "No files uploaded",
            });
          }

          const result = await this.uploadService.uploadImages(file);
          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: result,
          });
        } catch (e: unknown) {
          if (e instanceof Error) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: e.message,
            });
          }
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post(
      "/admin/deleteimage",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          const imageURL: string = req.body.imageurl;
          if (!imageURL) {
            return res.json({
              ReturnCode: ReturnCode.FAILED,
              message: "Image URL is required!",
            });
          }

          const result = await this.uploadService.deleteImage(imageURL);
          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: result,
          });
        } catch (e: unknown) {
          if (e instanceof Error) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: e.message,
            });
          }
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.FAILED,
          });
        }
      },
    );

    router.post(
      "/deleteimage",
      apiKeyGuard,
      async (req: Request, res: Response) => {
        try {
          const imageURL: string = req.body.imageurl;
          if (!imageURL) {
            return res.json({
              ReturnCode: ReturnCode.FAILED,
              message: "Image URL is required!",
            });
          }

          const result = await this.uploadService.deleteImage(imageURL);
          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data: result,
          });
        } catch (e: unknown) {
          if (e instanceof Error) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: e.message,
            });
          }
          return res.json({
            returncode: ReturnCode.FAILED,
            message: ReturnMessage.FAILED,
          });
        }
      },
    );

    return router;
  }
}
