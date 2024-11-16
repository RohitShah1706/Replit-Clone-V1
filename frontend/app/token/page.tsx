"use client";

import React, { useEffect } from "react";

import { useSocket } from "@/hooks/use-socket";

const Token = () => {
  const socket = useSocket("proj-75074a23ef3144bdb2b51c428be8c9b9");
  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }) => {
        console.log("rootContent", rootContent);
      });
    }
  }, [socket]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return <div>Obtained Socket</div>;
};

export default Token;
