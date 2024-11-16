"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const RUNNER_URL = process.env.NEXT_PUBLIC_RUNNER_URL || "";

export const useSocket = (projectId: string) => {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("auth token", session?.accessToken);
    if (status === "authenticated") {
      const newSocket = io(`ws://${projectId}.${RUNNER_URL}`, {
        auth: {
          token: session?.accessToken as string,
        },
      });

      newSocket.on("connect", () => {
        console.log("connected to socket");
        setSocket(newSocket);
      });

      return () => {
        console.log("disonnecting socket");
        newSocket.disconnect();
      };
    }
  }, [projectId, session]);

  return socket;
};
