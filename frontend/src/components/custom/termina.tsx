import { useEffect, useRef } from "react";

import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

function ab2str(buf: Buffer) {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 200,
  theme: {
    background: "black",
  },
};

const fitAddon = new FitAddon();

export const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) return;

    socket.emit("requestTerminal");
    socket.on("terminal:output", terminalHandler);

    // ! create new terminal
    const term = new Terminal(OPTIONS_TERM);
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    function terminalHandler({ data }: { data: Buffer }) {
      if (data instanceof ArrayBuffer) {
        console.log(data);
        console.log(ab2str(data));
        term.write(ab2str(data));
      }
    }

    term.onData((data) => {
      console.log(data);
      socket.emit("terminal:input", {
        data,
      });
    });

    socket.emit("terminal:input", {
      data: "\n",
    });

    return () => {
      socket.off("terminal:output", terminalHandler);
      term.dispose();
    };
  }, [terminalRef]);

  return <div className="w-[40vw] h-[400px] text-left" ref={terminalRef} />;
};
