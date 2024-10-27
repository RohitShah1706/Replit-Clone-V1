import dotenv from "dotenv";
dotenv.config();

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || "/home/abc/workspace";
const UID: number = parseInt(process.env.UID || "1001", 10);

const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT || "";
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION || "";
const AWS_EXPRESSAPP_USER_ACCESS_KEY =
  process.env.AWS_EXPRESSAPP_USER_ACCESS_KEY || "";
const AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY =
  process.env.AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY || "";

export {
  WORKSPACE_PATH,
  UID,
  AWS_S3_ENDPOINT,
  AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION,
  AWS_EXPRESSAPP_USER_ACCESS_KEY,
  AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
};
