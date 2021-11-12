import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { gameManagerFactory } from "./GameManager/GameManager";
import { IOSingleton } from "./IoSingleton";
import Dotenv from "dotenv";
import Log from "@frasermcc/log";
import { connect } from "./db/Connect";
import { initiateRoutes } from "./routes";

Dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
const port = process.env.PORT;

connect();

const app = express();
app.use(cors());

initiateRoutes(app);

const server = app.listen(port, () => {
  Log.info(`Server is running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  },
});

IOSingleton.initialize(io);
IOSingleton.getInstance().setGameManagerFactory(gameManagerFactory);

process.on("uncaughtException", (e) => {
  Log.error("Uncaught Exception:");
  Log.error(e.message);
});
