import { Router } from "express";

import { validateSchema } from "../middlewares/verifySchema";
import { orchestratorStartSchema } from "../schemas";
import { deployK8sManifests } from "../utils/k8s";

const router = Router();

router.post(
  "/start",
  validateSchema(orchestratorStartSchema),
  async (req, res) => {
    const { projectId } = req.body;

    const success = await deployK8sManifests(projectId);
    if (!success) {
      res.status(500).json({
        message: "Orchestrator start failed",
      });
    }

    res.status(200).json({
      message: "Service started successfully",
      projectId,
    });
  }
);

export default router;
