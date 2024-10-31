import { Socket } from "socket.io";
import chokidar from "chokidar";
import path from "path";

import { debounce } from "./debounce";
import { WORKSPACE_PATH } from "../config";
import { deleteFromS3, saveToS3 } from "./s3";

// TODO: add toIgnore array
const toIgnore = ["node_modules"];

export const startWatcher = (socket: Socket, projectId: string) => {
  // ! monitor WORKSPACE_PATH for changes
  console.log(
    `utils/watcher.ts:startWatcher: watching WORKSPACE_PATH: ${WORKSPACE_PATH}`
  );
  const s3Watcher = chokidar.watch(WORKSPACE_PATH, {
    ignoreInitial: true,
    interval: 5000, // check for normal changes every 5 seconds
    // ! awaitWriteFinish is used to wait for a file write operation to finish before emitting an event
    awaitWriteFinish: {
      pollInterval: 5000, // check for changes every 5 seconds
      stabilityThreshold: 5000, // wait for 5000 ms before emitting an event
    },
  });

  s3Watcher.on("all", async (event, filePath: string) => {
    const relativePath = path.relative(WORKSPACE_PATH, filePath);
    // console.log(
    //   `src/index.ts:s3Watcher: event: ${event}, filePath: ${filePath}`
    // );
    if (event === "add" || event === "change") {
      await saveToS3(`code/${projectId}/${relativePath}`, filePath);
    } else if (event === "unlink") {
      await deleteFromS3(`code/${projectId}/${relativePath}`);
    }
  });

  const frontEndWatcher = chokidar.watch(WORKSPACE_PATH, {
    ignoreInitial: true,
  });

  const debouncedEventHandler = debounce((event, filePath) => {
    // TODO: emit event to frontend: to build the tree
    // console.log(
    //   `src/index.ts:frontEndWatcher: ignore event: ${event}, filePath: ${filePath}`
    // );
    const relativePath = path.relative(WORKSPACE_PATH, filePath);
    console.log("relativePath", relativePath);
    socket.emit("file:refresh", {
      event,
      filePath: `/${relativePath}`,
    });
  }, 5000);

  frontEndWatcher.on("all", (event, filePath: string) => {
    const ignore = toIgnore.some((item) => filePath.includes(item));

    if (ignore) {
      debouncedEventHandler(event, filePath);
    } else {
      if (
        event === "add" ||
        event === "unlink" ||
        event === "addDir" ||
        event === "unlinkDir"
      ) {
        // console.log(
        //   `src/index.ts:frontEndWatcher: event: ${event}, filePath: ${filePath}`
        // );
        const relativePath = path.relative(WORKSPACE_PATH, filePath);
        console.log("relativePath", relativePath);
        socket.emit("file:refresh", {
          event,
          filePath: `/${relativePath}`,
        });
      }
    }
  });
};
