import dotenv from "dotenv";
dotenv.config();

const PROJECT_ID = process.env.PROJECT_ID || "runner";
const WORKSPACE_PATH = process.env.WORKSPACE_PATH || "/home/abc/workspace";
const LOGS_PATH = process.env.LOGS_PATH || "/home/root/custom_logs";
const UID: number = parseInt(process.env.UID || "1001", 10);
const GID: number = parseInt(process.env.GID || "1001", 10);

const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT || "";
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION || "";
const AWS_EXPRESSAPP_USER_ACCESS_KEY =
  process.env.AWS_EXPRESSAPP_USER_ACCESS_KEY || "";
const AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY =
  process.env.AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY || "";

export {
  PROJECT_ID,
  WORKSPACE_PATH,
  LOGS_PATH,
  UID,
  GID,
  AWS_S3_ENDPOINT,
  AWS_S3_BUCKET_NAME,
  AWS_S3_BUCKET_REGION,
  AWS_EXPRESSAPP_USER_ACCESS_KEY,
  AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
};
