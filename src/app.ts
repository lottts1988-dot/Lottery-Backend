import express from "express";
import bodyParser from "body-parser";
import { UserRepo } from "./repositories/user";
import { UserService } from "./services/user";
import { UserController } from "./controllers/user";
import { TicketRepo } from "./repositories/ticket";
import { TicketService } from "./services/ticket";
import { TicketController } from "./controllers/ticket";
import { CardRepo } from "./repositories/card";
import { CardService } from "./services/card";
import { CardController } from "./controllers/card";
import { AccountRepo } from "./repositories/account";
import { AccountController } from "./controllers/account";
import { AccountService } from "./services/account";
import { LotteryRepo } from "./repositories/lottery";
import { LotteryController } from "./controllers/lottery";
import { LotteryService } from "./services/lottery";
import { PaymentController } from "./controllers/payment";
import { PaymentRepo } from "./repositories/payment";
import { PaymentService } from "./services/payment";
import { OrderController } from "./controllers/order";
import { OrderRepo } from "./repositories/order";
import { OrderService } from "./services/order";
import { ResultRepo } from "./repositories/result";
import { ResultController } from "./controllers/result";
import { ResultService } from "./services/result";
import { UploadRepo } from "./repositories/upload";
import { UploadService } from "./services/upload";
import { UploadController } from "./controllers/upload";
import cors from "cors";
import { GeneratePDFController } from "./controllers/generate-pdf";
import { DashboardService } from "./services/dashboard";
import { DashboardController } from "./controllers/dashboard";

const app = express();

//// Security Secure
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRepository = new UserRepo();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use("/user", userController.router());

const ticketRepo = new TicketRepo();
const ticketService = new TicketService(ticketRepo);
const ticketController = new TicketController(ticketService);

app.use("/ticket", ticketController.router());

const cardRepo = new CardRepo();
const cardService = new CardService(cardRepo);
const cardController = new CardController(cardService);

app.use("/card", cardController.router());

const accountRepo = new AccountRepo();
const accountService = new AccountService(accountRepo);
const accountController = new AccountController(accountService);

app.use("/account", accountController.router());

const lotteryRepo = new LotteryRepo();
const lotteryService = new LotteryService(lotteryRepo);
const lotteryController = new LotteryController(lotteryService);

app.use("/lottery", lotteryController.router());

const paymentRepo = new PaymentRepo();
const paymentService = new PaymentService(paymentRepo);
const paymentController = new PaymentController(paymentService);

app.use("/payment", paymentController.router());

const orderRepo = new OrderRepo();
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

app.use("/order", orderController.router());

const resultRepo = new ResultRepo();
const resultService = new ResultService(resultRepo);
const resultController = new ResultController(resultService);

app.use("/result", resultController.router());

const uploadRepo = new UploadRepo();
const uploadService = new UploadService(uploadRepo);
const uploadController = new UploadController(uploadService);

app.use("/result", resultController.router());

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);
app.use("/dashboard", dashboardController.router());

app.use("/images", uploadController.router());

const generatePDFController = new GeneratePDFController();

app.use("/pdf", generatePDFController.router());

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ returncode: "200", message: "Lottery API V1.1.23 is working..." });
});

export default app;
