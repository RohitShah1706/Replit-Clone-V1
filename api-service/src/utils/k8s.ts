import path from "path";

import { readAndParseKubeYaml } from "../utils/parser";
import { appsV1Api, coreV1Api, networkingV1Api } from "../connection/k8s";
import { K8S_NAMESPACE } from "../config";

export const deployK8sManifests = async (projectId: string) => {
  try {
    const kubeManifsts = readAndParseKubeYaml(
      path.join(__dirname, "../../service.yaml"),
      projectId
    );

    for (const manifest of kubeManifsts) {
      //   console.log(
      //     `utils/k8s.ts:deployK8sManifests: manifest kind: ${manifest.kind}`
      //   );
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.createNamespacedDeployment(K8S_NAMESPACE, manifest);
          break;
        case "Service":
          await coreV1Api.createNamespacedService(K8S_NAMESPACE, manifest);
          break;
        case "Ingress":
          await networkingV1Api.createNamespacedIngress(
            K8S_NAMESPACE,
            manifest
          );
          break;
        default:
          console.log(
            `utils/k8s.ts:deployK8sManifests: Unsupported kind: ${manifest.kind}`
          );
      }
    }

    return true;
  } catch (error) {
    console.log(`utils/k8s.ts:deployK8sManifests: ERROR: ${error}`);
    return false;
  }
};
