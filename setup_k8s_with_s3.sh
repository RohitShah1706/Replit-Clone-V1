#!/bin/bash

# if minikube is not running, start it else echo "Minikube is running
if ! minikube status > /dev/null 2>&1; then
  minikube start --static-ip=192.168.49.2
fi
echo "Minikube is running"

minikubeIp=$(minikube ip)
echo "Minikube IP: $minikubeIp"

kubectl apply -f manifests/s3.yaml

# sleep 10 seconds
sleep 10

# # docker compose up -d s3
aws s3 mb s3://replit-clone --endpoint-url http://$minikubeIp:30000
aws s3 cp s3_base_contents s3://replit-clone/base --recursive --endpoint-url http://$minikubeIp:30000