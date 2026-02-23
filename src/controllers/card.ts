import { Router, type Request, type Response } from "express";
import type { CardService } from "../services/card";
import { verifyJwt } from "../utils/jwt";
import { ReturnCode, ReturnMessage } from "../types/response";
import type { TCard } from "../types/card";
import { apiKeyGuard } from "../utils/common";

export class CardController {
  constructor(private cardService: CardService) {}

  router(): Router {
    const router = Router();

    router.post(
      "/createcard",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          const data: TCard = req.body;

          const result = await this.cardService.createCard(data, req.user);
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
      "/getcards",
      apiKeyGuard,
      async (req: Request, res: Response) => {
        try {
          const result = await this.cardService.getCards(req.body);
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
      "/updatecard",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }
          const id: string = req.body.id;
          if (!id) {
            return res.json({
              ReturnCode: ReturnCode.FAILED,
              message: ReturnMessage.IDREQUIRED,
            });
          }

          const data: TCard = req.body;

          const result = await this.cardService.updateCard(id, data);
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
      "/deletecard",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }
          const id: string = req.body.id;
          if (!id) {
            return res.json({
              ReturnCode: ReturnCode.FAILED,
              message: ReturnMessage.IDREQUIRED,
            });
          }
          const result = await this.cardService.deleteCard(id);
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
