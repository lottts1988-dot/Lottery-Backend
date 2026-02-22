import rateLimit from "express-rate-limit";
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

const app = express();

//// Security Secure
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  statusCode: 200,
  message: {
    returnCode: "200",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use(
//   cors({
//     origin: ["https://edulottmm.com"],
//     methods: ["POST"],
//     credentials: true,
//   }),
// );
app.use(express.json({ limit: "100kb" }));
const allowedOrigins = ["https://edulottmm.com"];
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return res
      .status(200)
      .json({ returnCode: "200", message: "Origin required" });
  }

  if (!allowedOrigins.includes(origin)) {
    return res.status(200).json({ returnCode: "200", message: "Wrong Origin" });
  }

  next();
});
////

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

app.use("/images", uploadController.router());

app.get("/", (_req, res) => {
  res.status(200).json({ returncode: "200", message: "API is working..." });
});

export default app;
