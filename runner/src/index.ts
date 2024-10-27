import express from "express";
import { createServer } from "http";
import cors from "cors";

import { startWebsocketServer } from "./utils/ws";

const app = express();

// ! register middlewares
app.use(cors());

const httpServer = createServer(app);
startWebsocketServer(httpServer);

// // ! monitor WORKSPACE_PATH for changes
// const s3Watcher = chokidar.watch(WORKSPACE_PATH, {
//   ignoreInitial: true,
//   interval: 5000, // check for normal changes every 5 seconds
//   // ! awaitWriteFinish is used to wait for a file write operation to finish before emitting an event
//   awaitWriteFinish: {
//     pollInterval: 5000, // check for changes every 5 seconds
//     stabilityThreshold: 5000, // wait for 5000 ms before emitting an event
//   },
// });

// s3Watcher.on("all", (event, path) => {
//   if (event === "add" || event === "change") {
//     // TODO: saveToS3
//     console.log(`src/index.ts:s3Watcher: event: ${event}, path: ${path}`);
//   } else if (event === "unlink") {
//     // TODO: deleteFromS3
//     console.log(`src/index.ts:s3Watcher: event: ${event}, path: ${path}`);
//   }
// });

// const frontEndWatcher = chokidar.watch(WORKSPACE_PATH, {
//   ignoreInitial: true,
// });

// // TODO: add toIgnore array
// const toIgnore = ["node_modules"];

// const debouncedEventHandler = debounce((event, path) => {
//   // TODO: emit event to frontend: to build the tree
//   console.log(
//     `src/index.ts:frontEndWatcher: ignore event: ${event}, path: ${path}`
//   );
// }, 3000);

// frontEndWatcher.on("all", (event, path: string) => {
//   const ignore = toIgnore.some((item) => path.includes(item));

//   if (ignore) {
//     debouncedEventHandler(event, path);
//   } else {
//     if (
//       event === "add" ||
//       event === "unlink" ||
//       event === "addDir" ||
//       event === "unlinkDir"
//     ) {
//       // TODO emit event to frontend: to build the tree
//       console.log(
//         `src/index.ts:frontEndWatcher: event: ${event}, path: ${path}`
//       );
//     }
//   }
// });

// TODO: change to 443
const PORT = 1234;

const startServer = async () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(`src/index.ts:startServer: server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(`src/index.ts:startServer ERROR: ${error}`);
    process.exit(1);
  }
};

startServer();
