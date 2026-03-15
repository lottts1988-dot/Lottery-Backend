import { Router, type Request, type Response } from "express";
import { ReturnCode, ReturnMessage } from "../types/response";
import { apiKeyGuard } from "../utils/common";
import { createCanvas, loadImage } from "canvas";
import PDFDocument from "pdfkit";

interface TicketData {
  alphabet: string;
  number: string;
}

export class GeneratePDFController {
  router(): Router {
    const router = Router();

    router.post(
      "/generatepdf",
      apiKeyGuard,
      async (req: Request, res: Response) => {
        try {
          const {
            image: cloudUrl,
            ticket,
            invNo,
            xPercent = 0.52,
            yPercent = 0.13,
            fontScale = 0.07,
          } = req.body;

          if (!cloudUrl || !Array.isArray(ticket) || ticket.length === 0) {
            return res.json({
              returncode: ReturnCode.FAILED,
              message:
                "Invalid request. Ensure 'image' URL and 'ticket' array are provided.",
            });
          }

          const baseImage = await loadImage(cloudUrl);
          const { width, height } = baseImage;

          const doc = new PDFDocument({
            autoFirstPage: false,
            size: [width, height],
            margin: 0,
          });

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${invNo}.pdf`,
          );
          doc.pipe(res);

          const canvas = createCanvas(width, height);
          const ctx = canvas.getContext("2d");
          const fontSize = Math.floor(height * fontScale);

          for (const t of ticket as TicketData[]) {
            const serialText = `${t.alphabet}${t.number}`;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(baseImage, 0, 0, width, height);

            ctx.fillStyle = "black";
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textBaseline = "top";
            ctx.fillText(serialText, width * xPercent, height * yPercent);

            doc.addPage();
            doc.image(canvas.toBuffer("image/jpeg", { quality: 0.8 }), 0, 0);
          }

          doc.end();
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
