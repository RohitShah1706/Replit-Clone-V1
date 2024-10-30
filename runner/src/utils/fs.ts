import fs from "fs";
import path from "path";

interface File {
  type: "file" | "dir";
  name: string;
  path: string;
}

// .
// ├── t1
// │   ├── t2
// │   │   └── tmp3.txt
// │   └── tmp2.txt
// └── tmp1.txt

// Ex: want to fetchDir t1
export const fetchDir = (
  fullPath: string, // ! full path of the directory (WORKSPACE_PATH/t1)
  baseDir: string //   ! base directory (t1)
): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          files.map((file) => ({
            type: file.isDirectory() ? "dir" : "file",
            name: file.name,
            path: `${baseDir}/${file.name}`,
          }))
        );
      }
    });
  });
};

export const fetchFileContent = (fullPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const saveFile = (fullPath: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(fullPath);

    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }

      fs.writeFile(fullPath, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
