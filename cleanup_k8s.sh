#!/bin/bash

# Check if projectId is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <projectId>"
  exit 1
fi

# Assign the first argument to projectId
projectId=$1

# Delete the Kubernetes service and deployment
# kubectl delete deployment "$projectId"
kubectl delete job "$projectId"
# ! technically don't need to delete the service & ingress, as the job will delete it
kubectl delete service "$projectId"
kubectl delete ingress "$projectId"

# Check if the commands were successful
if [ $? -eq 0 ]; then
  echo "Successfully deleted resources for projectId: $projectId"
else
  echo "Failed to delete resources for projectId: $projectId"
fi