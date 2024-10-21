import { Router } from "express";

import { validateSchema } from "../middlewares/verifySchema";
import { projectCreateSchema } from "../schemas";
import { copyS3Folder } from "../utils/aws";
import { randomIdGenerator } from "../utils/randomIdGenerator";

const router = Router();

router.post("/", validateSchema(projectCreateSchema), async (req, res) => {
  const { language } = req.body;
  const projectId = `proj-${randomIdGenerator()}`;

  await copyS3Folder(`base/${language}`, `code/${projectId}`);

  res.status(200).json({
    message: "Project created successfully",
    project: {
      projectId,
      language,
    },
  });
});

export default router;
