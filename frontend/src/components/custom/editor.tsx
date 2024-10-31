import { useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";

import { FileTree } from "../custom/filetree";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ThemeModeToggle } from "../custom/theme-mode-toggle";
import { TerminalComponent } from "../custom/terminal";
import { buildFileTree, File, RemoteFile } from "../../lib/file-manager";
import CodeArea from "./code-area";

const Editor = ({
  files,
  onSelect,
  selectedFile,
  socket,
}: {
  files: RemoteFile[];
  onSelect: (file: File) => void;
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0]);
    }
  }, [selectedFile]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[100vh] rounded-lg border"
    >
      {/* FileTree Panel --- */}
      <ResizablePanel defaultSize={20} maxSize={35}>
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />

      {/* WorkSpace Panel --- */}
      <ResizablePanel defaultSize={80} minSize={65}>
        {/* Editor Panel ||| */}
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={65} minSize={65} maxSize={65}>
            <CodeArea socket={socket} selectedFile={selectedFile} />
          </ResizablePanel>
          <ResizableHandle />

          {/* Terminal Panel ||| */}
          <ResizablePanel defaultSize={35}>
            <div className="h-full">
              {socket && <TerminalComponent socket={socket} />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
export default Editor;
