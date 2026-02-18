import { Router, type Request, type Response } from "express";
import type { PaymentService } from "../services/payment";
import { ReturnCode, ReturnMessage } from "../types/response";
import type { TPayment } from "../types/payment";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  router(): Router {
    const router = Router();

    router.post("/createpayment", async (req: Request, res: Response) => {
      try {
        const data: TPayment = req.body;

        const result = await this.paymentService.createPayment(data);
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
    });

    return router;
  }
}
