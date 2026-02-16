import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { UserRepo } from "./repositories/user";
import { UserService } from "./services/user";
import { UserController } from "./controllers/user";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRepository = new UserRepo();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use("/user", userController.router());

app.get("/", (_req, res) => {
  res.status(200).json({ returncode: "200", message: "API is working..." });
});

export default app;
