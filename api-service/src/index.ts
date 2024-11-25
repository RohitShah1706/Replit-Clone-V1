import express from "express";
import cors from "cors";

import projectRouter from "./routers/project";
import orchestratorRouter from "./routers/orchestrator";
import { authenticateGithub } from "./middlewares/authenticateGithub";
import { log } from "./utils/logger";
import { prismaClient } from "./connection/prisma";

const app = express();

// ! register middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ! register routers
app.use("/project", projectRouter);
app.use("/orchestrator", orchestratorRouter);

app.get("/protected", authenticateGithub, (req, res) => {
  const emailId = res.locals.emailId;
  res.status(200).json({ emailId });
});

const PORT = 5000;

const startServer = async () => {
  try {
    // await prismaClient.$connect();
    // log(`src/index.ts:startServer: connected to db`);
    app.listen(PORT, () => {
      log(`src/index.ts:startServer: server started on port ${PORT}`);
    });
  } catch (error) {
    log(`src/index.ts:startServer ERROR: ${error}`, "error");
    process.exit(1);
  }
};

startServer();
