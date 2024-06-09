import fs from "fs";
import path from "path";
import {
  PutObjectCommandInput,
  PutObjectCommand,
  ListObjectsV2CommandInput,
  ListObjectsV2Command,
  GetObjectCommandInput,
  GetObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

import { s3Client } from "../connection/s3";
import { AWS_S3_BUCKET_NAME } from "../config";

const createFolder = (dirName: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(dirName, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const writeFile = (filePath: string, content: Uint8Array): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await createFolder(path.dirname(filePath));

    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(content, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });

    writeStream.end();
  });
};

const fetchS3FolderContents = async (key: string) => {
  const listObjectsParams: ListObjectsV2CommandInput = {
    Bucket: AWS_S3_BUCKET_NAME,
    Prefix: key,
  };

  const response = await s3Client.send(
    new ListObjectsV2Command(listObjectsParams)
  );

  return response;
};

export const saveToS3 = async (
  key: string,
  filePath: string,
  content: string
): Promise<void> => {
  const putObjectParams: PutObjectCommandInput = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${key}${filePath}`,
    Body: content,
  };

  try {
    await s3Client.send(new PutObjectCommand(putObjectParams));
  } catch (err) {
    console.error(`utils/s3.ts: saveToS3: ${err}`);
  }
};

export const fetchS3Folder = async (
  key: string,
  localPath: string
): Promise<void> => {
  const listObjectsParams: ListObjectsV2CommandInput = {
    Bucket: AWS_S3_BUCKET_NAME,
    Prefix: key,
  };

  try {
    const response = await fetchS3FolderContents(key);
    if (response.Contents) {
      await Promise.all(
        response.Contents.map(async (file) => {
          const fileKey = file.Key;
          if (fileKey) {
            const getObjectParams: GetObjectCommandInput = {
              Bucket: AWS_S3_BUCKET_NAME,
              Key: fileKey,
            };

            const data = await s3Client.send(
              new GetObjectCommand(getObjectParams)
            );
            if (data.Body) {
              const fileData = data.Body;
              const filePath = `${localPath}/${fileKey.replace(key, "")}`;

              await writeFile(filePath, await fileData.transformToByteArray());
              console.log(
                `utils/s3.ts: fetchS3Folder: Downloaded ${fileKey} to ${filePath}`
              );
            }
          }
        })
      );
    }
  } catch (error) {
    console.error(`utils/s3.ts: fetchS3Folder: ${error}`);
  }
};

export const copyS3Folder = async (
  sourcePrefix: string,
  destinationPrefix: string,
  continuationToken?: string
): Promise<void> => {
  try {
    const listObjectsResponse = await fetchS3FolderContents(sourcePrefix);
    if (
      !listObjectsResponse.Contents ||
      listObjectsResponse.Contents.length === 0
    )
      return;

    await Promise.all(
      listObjectsResponse.Contents.map(async (object): Promise<void> => {
        if (!object.Key) return;

        const destinationKey = object.Key.replace(
          sourcePrefix,
          destinationPrefix
        );

        const copyParams: CopyObjectCommandInput = {
          Bucket: AWS_S3_BUCKET_NAME,
          CopySource: `${AWS_S3_BUCKET_NAME}/${object.Key}`,
          Key: destinationKey,
        };

        await s3Client.send(new CopyObjectCommand(copyParams));
        console.log(
          `utils/s3.ts: copyS3Folder: Copied ${object.Key} to ${destinationKey}`
        );
      })
    );
  } catch (error) {
    console.error(`utils/s3.ts: copyS3Folder: ${error}`);
  }
};
