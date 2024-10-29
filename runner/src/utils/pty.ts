import { IPty, spawn } from "node-pty";

import { WORKSPACE_PATH, UID, GID } from "../config";

// ! const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
const SHELL = "bash";

export class TerminalManager {
  private sessions: {
    [id: string]: { terminal: IPty; projectId: string };
  } = {};

  constructor() {
    this.sessions = {};
  }

  createPty(
    terminalId: string, // ! terminalId = socket.id (we want to open multiple terminals)
    projectId: string,
    onData: (data: string, id: number) => void // ! callback function to send data back to the user
  ) {
    const ptyProcess = spawn(SHELL, [], {
      name: "xterm-color",
      cols: 200,
      rows: 500,
      cwd: WORKSPACE_PATH,
      env: process.env,
      uid: UID,
      gid: GID,
    });

    ptyProcess.onData((data) => {
      onData(data, ptyProcess.pid);
    });

    ptyProcess.onExit(() => {
      console.log(`utils/pty.ts:TerminalManager: pty ${terminalId} exited`);
      delete this.sessions[terminalId];
    });

    this.sessions[terminalId] = {
      terminal: ptyProcess,
      projectId: projectId,
    };

    console.log(`utils/pty.ts:TerminalManager: created pty ${terminalId}`);

    return ptyProcess;
  }

  write(terminalId: string, data: string) {
    this.sessions[terminalId]?.terminal.write(data);
  }

  clear(terminalId: string) {
    this.sessions[terminalId]?.terminal.kill();
    delete this.sessions[terminalId];
  }
}
