import dotenv from "dotenv";
dotenv.config();

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || "/home/abc/workspace";

export { WORKSPACE_PATH };
