"use client";

import { useEffect, useRef, useState } from "react";

import { Socket } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
// import { FitAddon } from "@xterm/addon-fit";
import { useTheme } from "next-themes";

// const fitAddon = new FitAddon();

const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
  const { theme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isTerminalInitialized, setIsTerminalInitialized] = useState(false);

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) return;

    setIsTerminalInitialized(false);

    socket.emit("requestTerminal");
    socket.on("terminal:output", terminalHandler);

    // ! create new terminal
    const term = new Terminal({
      cursorBlink: true,
      lineHeight: 1.3,
      theme: {
        background: theme === "dark" ? "#1e1e1e" : "#ffffff",
      },
      cols: 1000,
      rows: 500,
    });
    // term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    // fitAddon.fit();

    function terminalHandler({ data }: { data: string }) {
      term.write(data);
      term.scrollToBottom();
    }

    term.onData((data) => {
      socket.emit("terminal:input", {
        data,
      });
      term.scrollToBottom();
    });

    socket.emit("terminal:input", {
      data: "clear\n",
    });

    setIsTerminalInitialized(true);

    return () => {
      socket.off("terminal:output", terminalHandler);
      term.dispose();
    };
  }, [terminalRef, theme]);

  if (!isTerminalInitialized)
    return (
      <div className="h-full w- flex items-center justify-center">
        Loading...
      </div>
    );

  return <div className="h-full w-full" ref={terminalRef} id="terminal" />;
};

export default TerminalComponent;
