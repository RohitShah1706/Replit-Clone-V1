import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = (projectId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const RUNNER_URL = process.env.NEXT_PUBLIC_RUNNER_URL || "";

  useEffect(() => {
    const newSocket = io(`ws://${projectId}.${RUNNER_URL}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  return socket;
};
