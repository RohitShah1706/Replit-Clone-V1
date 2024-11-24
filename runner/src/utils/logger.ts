import winston from "winston";

import { LOGS_PATH, PROJECT_ID } from "../config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { projectId: PROJECT_ID },
  transports: [
    new winston.transports.File({
      filename: `${LOGS_PATH}/${PROJECT_ID}.log`,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export const log = (message: string, type: string = "info") => {
  if (type === "error") {
    logger.error(message);
  } else {
    logger.info(message);
  }
};
