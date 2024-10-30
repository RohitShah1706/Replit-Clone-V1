import { useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { ThemeModeToggle } from "../components/custom/theme-mode-toggle";
import { TerminalComponent } from "../components/custom/terminal";
import { useSocket } from "../hooks/use-socket";
import { useParams } from "react-router-dom";

const CodingPage = () => {
  const projectId = useParams().projectId || "";
  console.log(projectId);
  // const socket = useSocket("proj-aaaa0eef0b1a40188a4299b506a08dc4");
  const socket = useSocket(projectId);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[100vh] rounded-lg border"
    >
      {/* FileTree Panel --- */}
      <ResizablePanel defaultSize={20} maxSize={35}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">FileTree</span>
          <ThemeModeToggle />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* WorkSpace Panel --- */}
      <ResizablePanel defaultSize={80} minSize={65}>
        {/* Editor Panel ||| */}
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60} minSize={60}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Editor</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Terminal Panel ||| */}
          <ResizablePanel>
            <div className="h-full">
              {socket && <TerminalComponent socket={socket} />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodingPage;
