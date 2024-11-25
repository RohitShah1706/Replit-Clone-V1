import {
  AppsV1Api,
  BatchV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1Api,
} from "@kubernetes/client-node";

import { log } from "../utils/logger";
import { K8S_CONFIG_FILE_PATH, NODE_ENV } from "../config";

// console.log("K8S_CONFIG_FILE_PATH", K8S_CONFIG_FILE_PATH);

const kubeConfig = new KubeConfig();
if (NODE_ENV === "production") {
  log("Loading k8s config from file");
  kubeConfig.loadFromFile(K8S_CONFIG_FILE_PATH);
} else {
  // ! loads the default k8s config from ~/.kube/config
  log("Loading k8s config from default");
  kubeConfig.loadFromDefault();
}

const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeConfig.makeApiClient(NetworkingV1Api);
const batchV1Api = kubeConfig.makeApiClient(BatchV1Api);

export { coreV1Api, appsV1Api, networkingV1Api, batchV1Api };
