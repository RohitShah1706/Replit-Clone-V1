import express from "express";
import { TerminalManager } from "./utils/pty"; // Adjust the import path as needed

const app = express();
const port = 5000;
const terminalManager = new TerminalManager();

app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to create a new terminal session
app.post("/create", (req, res) => {
  const { terminalId, projectId } = req.body;

  if (!terminalId || !projectId) {
    res.status(400).json({ error: "terminalId and projectId are required" });
    return;
  }

  const ptyProcess = terminalManager.createPty(
    terminalId,
    projectId,
    (data, id) => {
      console.log(`Data from terminal ${id}: ${data}`);
    }
  );

  res.status(201).json({ message: "Terminal created", pid: ptyProcess.pid });
});

// Endpoint to write data to an existing terminal session
app.post("/write", (req, res) => {
  const { terminalId, data } = req.body;

  if (!terminalId || !data) {
    res.status(400).json({ error: "terminalId and data are required" });
    return;
  }

  terminalManager.write(terminalId, data);
  res.status(200).json({ message: "Data written to terminal" });
});

// Endpoint to clear and delete an existing terminal session
app.post("/clear", (req, res) => {
  const { terminalId } = req.body;

  if (!terminalId) {
    res.status(400).json({ error: "terminalId is required" });
    return;
  }

  terminalManager.clear(terminalId);
  res.status(200).json({ message: "Terminal cleared and deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
