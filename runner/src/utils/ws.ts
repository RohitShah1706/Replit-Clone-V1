import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

import { TerminalManager } from "./pty";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { WORKSPACE_PATH } from "../config";
import { startWatcher } from "./watcher";
import { authenticateSocket } from "./authenticateSocket";

const terminalManager = new TerminalManager();

const ab2str = (buf: Buffer) => {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
};

export const startWebsocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      // TODO: restrict to frontend origin only
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", async (socket) => {
    // host = projectId.runner.local
    const host = socket.handshake.headers.host;
    const projectId = host?.split(".")[0];

    console.log(`utils/ws.ts:startWebsocketServer: connected to ${projectId}`);

    if (!projectId) {
      socket.disconnect();
      terminalManager.clear(socket.id);
      return;
    }

    socket.emit("loaded", {
      // TODO: replace with rootContent: await fetchDir("/workspace", "")
      // message: "Websocket connected",
      rootContent: await fetchDir(`${WORKSPACE_PATH}`, ""),
    });

    initHandlers(socket, projectId);
    startWatcher(socket, projectId);
  });
};

const initHandlers = (socket: Socket, projectId: string) => {
  socket.on("disconnect", () => {
    console.log(
      `utils/ws.ts:initHandlers: ${projectId} disconnected from websocket`
    );
    terminalManager.clear(socket.id);
  });

  // TODO: allow clients to open multiple terminals by using some id other than socket.id
  // TODO: commands will be sent to terminal:input over same socket but use some kind of terminalId
  socket.on("requestTerminal", async () => {
    terminalManager.createPty(socket.id, projectId, (data, id) => {
      socket.emit("terminal:output", {
        data,
      });
    });
  });

  socket.on("terminal:input", async ({ data }: { data: string }) => {
    terminalManager.write(socket.id, data);
  });

  socket.on("fetchDir", async (dir: string, callback) => {
    const fullPath = `${WORKSPACE_PATH}/${dir}`;
    const contents = await fetchDir(fullPath, dir);
    callback(contents);
  });

  socket.on(
    "fetchContent",
    async ({ path: filePath }: { path: string }, callback) => {
      const fullPath = `${WORKSPACE_PATH}/${filePath}`;
      const data = await fetchFileContent(fullPath);
      callback(data);
    }
  );

  socket.on(
    "updateContent",
    async ({ path: filePath, content }: { path: string; content: string }) => {
      const fullPath = `${WORKSPACE_PATH}/${filePath}`;
      await saveFile(fullPath, content);
    }
  );
};
