import winston from "winston";

import { LOGS_PATH } from "../config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "api-service" },
  transports: [
    new winston.transports.File({
      filename: `${LOGS_PATH}/api-service.log`,
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
