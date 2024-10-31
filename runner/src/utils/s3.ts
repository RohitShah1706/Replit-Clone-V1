import fs from "fs";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { s3Client } from "../connection/s3";
import { AWS_S3_BUCKET_NAME } from "../config";

export const saveToS3 = async (
  key: string,
  filePath: string
): Promise<void> => {
  // console.log(
  //   `utils/s3.ts:saveToS3: uploading filePath: ${filePath} to S3 key: ${key}`
  // );
  const fileStream = fs.createReadStream(filePath);

  const params: PutObjectCommandInput = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${key}`,
    Body: fileStream,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    // console.log(
    //   `utils/s3.ts:saveToS3: File uploaded successfully to ${params.Bucket}/${params.Key}`
    // );
  } catch (error) {
    // console.error(`utils/s3.ts:saveToS3: Error uploading file to S3: ${error}`);
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  // console.log(`utils/s3.ts:deleteFromS3: deleting key: ${key}`);

  try {
    const params: DeleteObjectCommandInput = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    // console.log(
    //   `utils/s3.ts:deleteFromS3: File deleted successfully from ${AWS_S3_BUCKET_NAME}/${key}`
    // );
  } catch (error) {
    console.error(
      `utils/s3.ts:deleteFromS3: Error deleting file from S3: ${error}`
    );
  }
};
