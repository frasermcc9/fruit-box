import express, { Application, Router } from "express";
import GlobalCollection from "../db/models/global/GlobalCollection";

export const initiateRoutes = (app: Application) => {
  const router = express.Router();

  v1Api(router);
  app.use("/v1", router);
};

const v1Api = (base: Router) => {
  const router = express.Router();
  stats(router);

  base.use("/stats", router);

  base.get("/ping", (req, res) => {
    res.status(200).send("Pong!");
  });
};

const stats = (router: Router) => {
  router.get("/time", async (req, res) => {
    const globals = await GlobalCollection.getCollection();
    res.status(200).send(JSON.stringify(globals.secondsUsed));
  });

  router.get("/boards", async (req, res) => {
    const globals = await GlobalCollection.getCollection();
    const boards = await globals.getSubmissions("blitz", "classic");
    res.status(200).send(JSON.stringify(boards));
  });
};
