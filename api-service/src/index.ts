import express from "express";
import cors from "cors";

import projectRouter from "./routers/project";

const app = express();

// ! register middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ! register routers
app.use("/project", projectRouter);

const PORT = 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`src/index.ts:startServer: server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(`src/index.ts:startServer ERROR: ${error}`);
    process.exit(1);
  }
};

startServer();
