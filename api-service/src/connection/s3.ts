import { S3Client } from "@aws-sdk/client-s3";

import {
  AWS_S3_ENDPOINT,
  AWS_S3_BUCKET_REGION,
  AWS_EXPRESSAPP_USER_ACCESS_KEY,
  AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
} from "../config";

export const s3Client = new S3Client({
  endpoint: AWS_S3_ENDPOINT,
  forcePathStyle: true, // ! required for localstack
  region: AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_EXPRESSAPP_USER_ACCESS_KEY,
    secretAccessKey: AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
  },
});
