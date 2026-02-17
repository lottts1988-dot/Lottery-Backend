import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { UserRepo } from "./repositories/user";
import { UserService } from "./services/user";
import { UserController } from "./controllers/user";
import { TicketRepo } from "./repositories/ticket";
import { TicketService } from "./services/ticket";
import { TicketController } from "./controllers/ticket";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRepository = new UserRepo();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use("/user", userController.router());

const userRepo = new TicketRepo();
const ticketService = new TicketService(userRepo);
const ticketController = new TicketController(ticketService);

app.use("/ticket", ticketController.router());

app.get("/", (_req, res) => {
  res.status(200).json({ returncode: "200", message: "API is working..." });
});

export default app;
