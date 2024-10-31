import { useEffect, useState } from "react";

import { useSocket } from "../hooks/use-socket";
import { useParams } from "react-router-dom";
import { File, RemoteFile, Type } from "../lib/file-manager";
import Editor from "../components/custom/editor";

const CodingPage = () => {
  const projectId = useParams().projectId || "";
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const socket = useSocket(projectId);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", (data) => {
        console.log(data);
        setLoaded(true);
        // TODO: replace with real data coming from socket
        const mockFileStructure: RemoteFile[] = [
          {
            type: "dir",
            name: "test",
            path: "",
          },
          {
            type: "file",
            name: "index.html",
            path: "index.html",
          },
          {
            type: "file",
            name: "index.js",
            path: "index.js",
          },
        ];
        setFileStructure(mockFileStructure);
      });
    }
  }, [socket]);

  const onSelect = (file: File) => {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  if (!loaded || !socket) return <div>Loading...</div>;

  return (
    <Editor
      socket={socket}
      selectedFile={selectedFile}
      onSelect={onSelect}
      files={fileStructure}
    />
  );
};

export default CodingPage;
