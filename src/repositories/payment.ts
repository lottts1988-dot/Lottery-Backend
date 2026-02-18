import type { TPayment } from "../types/payment";
import { generateInvoice } from "../utils/common";
import { prisma } from "../utils/prisma";

export class PaymentRepo {
  public async createPayment(data: TPayment) {
    const { ticket, name, address, phone, purchasedate, screenshot } = data;

    const lottery = await prisma.lottery.findFirst({
      where: {
        isDeleted: false,
        isSelect: true,
      },
    });

    await prisma.ticket.updateMany({
      where: {
        id: { in: ticket },
      },
      data: {
        status: "02",
      },
    });

    const result = await prisma.payment.create({
      data: {
        ticket: {
          connect: ticket.map((id: string) => ({ id })),
        },
        name,
        address,
        phone,
        purchasedate,
        screenshot,
      },
    });
    const invoiceno = "INV" + generateInvoice();
    const webURL = `http://localhost:3000/${invoiceno}`;

    const qrcode = Buffer.from(webURL, "utf-8").toString("base64");
    await prisma.order.create({
      data: {
        invoiceno,
        qrcode,
        status: "01",
        paymentid: result.id,
        lotteryid: lottery == null ? "" : lottery.id,
      },
    });
    return result;
  }
}
