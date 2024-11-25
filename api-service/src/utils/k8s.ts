import path from "path";

import { readAndParseKubeYaml } from "../utils/parser";
import {
  appsV1Api,
  batchV1Api,
  coreV1Api,
  networkingV1Api,
} from "../connection/k8s";
import { log } from "./logger";
import { K8S_NAMESPACE } from "../config";

export const deployK8sManifests = async (projectId: string) => {
  try {
    const kubeManifsts = readAndParseKubeYaml(
      path.join(__dirname, "../../service.yaml"),
      projectId
    );

    let jobUid = "";
    for (const manifest of kubeManifsts) {
      // console.log(
      //   `utils/k8s.ts:deployK8sManifests: manifest kind: ${manifest.kind}`
      // );
      switch (manifest.kind) {
        // case "Deployment":
        //   await appsV1Api.createNamespacedDeployment(K8S_NAMESPACE, manifest);
        //   break;
        case "Job":
          const res = await batchV1Api.createNamespacedJob(
            K8S_NAMESPACE,
            manifest
          );
          jobUid = res.body.metadata?.uid || "";
          // console.log(`utils/k8s.ts:deployK8sManifests: jobUid: ${jobUid}`);
          break;
        case "Service":
          // ! make Job the owner for the Service - so Service is deleted when Job is deleted
          manifest.metadata.ownerReferences = [
            {
              apiVersion: "batch/v1",
              kind: "Job",
              name: projectId,
              uid: jobUid,
            },
          ];
          await coreV1Api.createNamespacedService(K8S_NAMESPACE, manifest);
          break;
        case "Ingress":
          // ! make Job the owner for the Ingress - so Ingress is deleted when Job is deleted
          manifest.metadata.ownerReferences = [
            {
              apiVersion: "batch/v1",
              kind: "Job",
              name: projectId,
              uid: jobUid,
            },
          ];
          await networkingV1Api.createNamespacedIngress(
            K8S_NAMESPACE,
            manifest
          );
          break;
        default:
          log(
            `utils/k8s.ts:deployK8sManifests: Unsupported kind: ${manifest.kind}`
          );
      }
    }

    return true;
  } catch (error) {
    log(`utils/k8s.ts:deployK8sManifests: ERROR: ${error}`, "error");
    return false;
  }
};
