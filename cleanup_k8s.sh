#!/bin/bash

# Check if projectId is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <projectId>"
  exit 1
fi

# Assign the first argument to projectId
projectId=$1

# Delete the Kubernetes service and deployment
kubectl delete service "$projectId"
kubectl delete deployment "$projectId"

# Check if the commands were successful
if [ $? -eq 0 ]; then
  echo "Successfully deleted service and deployment for projectId: $projectId"
else
  echo "Failed to delete service and/or deployment for projectId: $projectId"
fi