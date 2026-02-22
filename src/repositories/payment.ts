import type { TPayment } from "../types/payment";
import { generateInvoice } from "../utils/common";
import { prisma } from "../utils/prisma";

export class PaymentRepo {
  public async createPayment(data: TPayment) {
    const { ticket, name, address, phone, screenshot } = data;

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
        status: "04",
      },
    });

    const payment = await prisma.payment.create({
      data: {
        ticket: {
          connect: ticket.map((id: string) => ({ id })),
        },
        name,
        address,
        phone,
        screenshot,
      },
    });
    const invoiceno = "INV" + generateInvoice();
    const webURL = `http://localhost:3000/${invoiceno}`;

    const qrcode = Buffer.from(webURL, "utf-8").toString("base64");
    const result = await prisma.order.create({
      data: {
        invoiceno,
        qrcode,
        status: "01",
        paymentid: payment.id,
        lotteryid: lottery == null ? "" : lottery.id,
      },
      include: {
        payment: {
          include: {
            ticket: true,
          },
        },
        lottery: true,
      },
    });
    return result;
  }
}
