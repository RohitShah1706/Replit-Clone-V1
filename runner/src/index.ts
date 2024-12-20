import express from "express";
import { createServer } from "http";
import cors from "cors";

import { startWebsocketServer } from "./utils/ws";
import { log } from "./utils/logger";

const app = express();

// ! register middlewares
app.use(cors());

const httpServer = createServer(app);
startWebsocketServer(httpServer);

// TODO: change to 443
const PORT = 1234;

const startServer = async () => {
  try {
    httpServer.listen(PORT, () => {
      log(`src/index.ts:startServer: server started on port ${PORT}`, "error");
    });
  } catch (error) {
    log(`src/index.ts:startServer ERROR: ${error}`);
    process.exit(1);
  }
};

startServer();
