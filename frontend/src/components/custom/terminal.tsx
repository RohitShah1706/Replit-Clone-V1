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
    console.log("starting terminal");
    console.log(!terminalRef, !terminalRef.current, !socket);
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
      scrollback: 10000,
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
      data: "\n",
    });

    const handleResize = () => {
      console.log("handleResize");
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      socket.off("terminal:output", terminalHandler);
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [terminalRef, theme]);

  return (
    <div className="h-full w-full py-1">
      <div className="h-full w-full mt-0" ref={terminalRef} id="terminal" />
    </div>
  );
};
