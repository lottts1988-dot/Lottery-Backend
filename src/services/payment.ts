import type { PaymentRepo } from "../repositories/payment";
import type { TPayment } from "../types/payment";

export class PaymentService {
  constructor(private paymentRepo: PaymentRepo) {
    this.paymentRepo = paymentRepo;
  }

  public async createPayment(data: TPayment) {
    const createpayment = await this.paymentRepo.createPayment(data);
    return createpayment;
  }
}
