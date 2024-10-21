import {
  AppsV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1Api,
} from "@kubernetes/client-node";

const kubeConfig = new KubeConfig();
// ! loads the default k8s config from ~/.kube/config
kubeConfig.loadFromDefault();

const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeConfig.makeApiClient(NetworkingV1Api);

export { coreV1Api, appsV1Api, networkingV1Api };
