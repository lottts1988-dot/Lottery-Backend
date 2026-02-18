import express from "express";
import cors from "cors";
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

const app = express();

app.use(cors());
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

app.get("/", (_req, res) => {
  res.status(200).json({ returncode: "200", message: "API is working..." });
});

export default app;
