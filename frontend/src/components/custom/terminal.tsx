import { useEffect, useRef } from "react";

import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { useTheme } from "../providers/theme-provider";

const fitAddon = new FitAddon();

export const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
  const { theme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) return;

    socket.emit("requestTerminal");
    socket.on("terminal:output", terminalHandler);

    // ! create new terminal
    const term = new Terminal({
      cursorBlink: true,
      lineHeight: 1.3,
      theme: {
        background: theme === "dark" ? "#1e1e1e" : "#ffffff",
      },
      cols: 200,
      rows: 500,
    });
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    function terminalHandler({ data }: { data: string }) {
      term.write(data);
      term.scrollToBottom();
    }

    term.onData((data) => {
      console.log(data);
      socket.emit("terminal:input", {
        data,
      });
      term.scrollToBottom();
    });

    socket.emit("terminal:input", {
      data: "clear\n",
    });

    return () => {
      socket.off("terminal:output", terminalHandler);
      term.dispose();
    };
  }, [terminalRef, theme]);

  return <div className="h-full w-full" ref={terminalRef} id="terminal" />;
};
