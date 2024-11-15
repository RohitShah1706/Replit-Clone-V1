import { Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";

import { File } from "@/lib/file-manager";

const CodeArea = ({
  selectedFile,
  socket,
}: {
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  if (!selectedFile) return null;

  const code = selectedFile.content;
  let language = selectedFile.name.split(".").pop();

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "py") language = "python";

  function debounce(func: (value: string) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(value);
      }, wait);
    };
  }

  return (
    <Editor
      height="100vh"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={(value) => {
        if (typeof value === "string") {
          debounce((value) => {
            socket.emit("updateContent", {
              path: selectedFile.path,
              content: value,
            });
          }, 500)(value);
        }
      }}
    />
  );
};

export default CodeArea;
