import { Router, type Request, type Response } from "express";
import type { UploadService } from "../services/upload";
import { upload } from "../utils/upload";
import { verifyJwt } from "../utils/jwt";
import { ReturnCode, ReturnMessage } from "../types/response";

export class UploadController {
  constructor(private uploadService: UploadService) {}

  router(): Router {
    const router = Router();

    router.post(
      "/uploads",
      verifyJwt,
      upload.array("images", 10),
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          const files = req.files as Express.Multer.File[];

          console.log(files);

          if (!files?.length) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: "No files uploaded",
            });
          }

          const result = await this.uploadService.uploadImages(files);
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
