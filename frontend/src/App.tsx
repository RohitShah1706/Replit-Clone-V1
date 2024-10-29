import { useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { ThemeModeToggle } from "./components/custom/theme-mode-toggle";
import { ThemeProvider } from "./components/providers/theme-provider";
import { useSocket } from "./hooks/use-socket";
import { TerminalComponent } from "./components/custom/terminal";

function App() {
  // const socket = useSocket("proj-aaaa0eef0b1a40188a4299b506a08dc4");
  const socket = useSocket("proj-75074a23ef3144bdb2b51c428be8c9b9");

  useEffect(() => {
    if (socket) {
      socket.on("loaded", (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="replit-clone-theme">
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
              <ResizablePanel defaultSize={70} minSize={40}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Editor</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />

              {/* Terminal Panel ||| */}
              <ResizablePanel>
                {socket && <TerminalComponent socket={socket} />}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ThemeProvider>
    </>
  );
}

export default App;
