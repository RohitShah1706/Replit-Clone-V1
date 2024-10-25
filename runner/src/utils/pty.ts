import { IPty, spawn } from "node-pty";

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
    terminalId: string,
    projectId: string,
    onData: (data: string, id: number) => void // ! callback function to send data back to the user
  ) {
    const ptyProcess = spawn(SHELL, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME + "/workspace",
      env: process.env,
    });

    ptyProcess.onData((data) => {
      onData(data, ptyProcess.pid);
    });

    ptyProcess.onExit(() => {
      delete this.sessions[ptyProcess.pid];
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
    this.sessions[terminalId]?.terminal.clear();
    delete this.sessions[terminalId];
  }
}
