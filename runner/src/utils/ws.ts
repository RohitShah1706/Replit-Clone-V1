import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

import { TerminalManager } from "./pty";

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
      message: "Websocket connected",
    });

    initHandlers(socket, projectId);
  });
};

const initHandlers = (socket: Socket, projectId: string) => {
  socket.on("disconnect", () => {
    console.log(
      `utils/ws.ts:initHandlers: %{projectId} disconnected from websocket`
    );
  });

  socket.on("requestTerminal", async () => {
    terminalManager.createPty(socket.id, projectId, (data, id) => {
      // ! FOR TESTING ONLY
      // console.log(ab2str(Buffer.from(data, "utf-8")));
      socket.emit("terminal:output", {
        data: Buffer.from(data, "utf-8"),
      });
    });
  });

  socket.on(
    "terminal:input",
    async ({ data }: { data: string; terminalId: number }) => {
      terminalManager.write(socket.id, data);
    }
  );
};
