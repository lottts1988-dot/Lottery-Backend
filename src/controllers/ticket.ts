import { Router, type Request, type Response } from "express";
import type { TicketService } from "../services/ticket";
import { verifyJwt } from "../utils/jwt";
import { ReturnCode, ReturnMessage } from "../types/response";
import type { CreateTicket, UpdateTicket } from "../types/ticket";

export class TicketController {
  constructor(private ticketService: TicketService) {}

  router(): Router {
    const router = Router();

    router.post(
      "/createticket",
      verifyJwt,
      async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message: ReturnMessage.UNAUTHORIZED,
            });
          }

          const data: CreateTicket = req.body;

          const result = await this.ticketService.createTicket(data, req.user);
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
      "/getcurrentmonthticket",
      async (req: Request, res: Response) => {
        try {
          const result = await this.ticketService.getCurrentMonthTicket(
            req.body,
          );
          const { data, meta } = result;
          return res.json({
            returncode: ReturnCode.SUCCESS,
            message: ReturnMessage.SUCCESS,
            data,
            meta,
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
      "/updateticket",
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

          const data: UpdateTicket = req.body;

          const result = await this.ticketService.updateTicket(id, data);
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
      "/deleteticket",
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
          const result = await this.ticketService.deleteTicket(id);
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
