import {
  CopyObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  ListObjectsV2CommandInput,
  CopyObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { s3Client } from "../connection/s3";
import { log } from "./logger";
import { AWS_S3_BUCKET_NAME } from "../config";

// ! copy one folder in s3 to another folder in s3
export const copyS3Folder = async (
  sourcePrefix: string, // source s3 path in bucket://base/${language}
  destinationPrefix: string, // dest s3 path in bucket://code/${projectId}
  continuationToken?: string
) => {
  try {
    // list all objects in the source folder
    const listParams: ListObjectsV2CommandInput = {
      Bucket: AWS_S3_BUCKET_NAME,
      Prefix: sourcePrefix,
      ContinuationToken: continuationToken,
    };

    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return;
    }

    // in parallel, copy all objects to the destination folder
    await Promise.all(
      listedObjects.Contents.map(async (object) => {
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
        // console.log(
        //   `utils/aws.ts:copyS3FolderToLocal: copied ${object.Key} to ${destinationKey}`
        // );
      })
    );

    // check if the list was trucated and if so, call this function again with the continuation token
    if (listedObjects.IsTruncated) {
      await copyS3Folder(
        sourcePrefix,
        destinationPrefix,
        listedObjects.NextContinuationToken
      );
    }
  } catch (error) {
    log(`utils/aws.ts:copyS3Folder ERROR: ${error}`, "error");
  }
};

export const saveToS3 = async (
  key: string, // s3 path in bucket://code/${projectId}
  filePath: string, // local file path
  content: string
): Promise<void> => {
  const putParams: PutObjectCommandInput = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${key}${filePath}`,
    Body: content,
  };

  await s3Client.send(new PutObjectCommand(putParams));
};
