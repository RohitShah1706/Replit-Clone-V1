import { useEffect, useState } from "react";

import { useSocket } from "../hooks/use-socket";
import { useParams } from "react-router-dom";
import { File, RemoteFile, Type } from "../lib/file-manager";
import Editor from "../components/custom/editor";

const getBasename = (filePath: string) => {
  console.log("called getBasename");
  const toRet = filePath.split("/").pop() || "";
  console.log("getBasename", toRet);
  return toRet;
};

const CodingPage = () => {
  const projectId = useParams().projectId || "";
  const [loaded, setLoaded] = useState(false);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const socket = useSocket(projectId);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });

      socket.on(
        "file:refresh",
        ({ event, filePath }: { event: string; filePath: string }) => {
          console.log("file:refresh", event, filePath);
          setFileStructure((prev) => {
            const allFiles = [...prev];
            const index = allFiles.findIndex((file) => file.path === filePath);
            console.log("index", index);

            if (index !== -1 && (event === "unlink" || event === "unlinkDir")) {
              allFiles.splice(index, 1);
            } else if (event === "add") {
              allFiles.splice(index, 0, {
                type: "file",
                name: getBasename(filePath),
                path: filePath,
              });
            } else if (event === "addDir") {
              allFiles.splice(index, 0, {
                type: "dir",
                name: getBasename(filePath),
                path: filePath,
              });
            }

            return allFiles;
          });
        }
      );
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
