#!/bin/bash

# Check if projectId is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <projectId>"
  exit 1
fi

# Assign the first argument to projectId
projectId=$1

# Delete the Kubernetes service and deployment
# kubectl delete deployment "$projectId" -n replit-app
kubectl delete job "$projectId" -n replit-app
# ! technically don't need to delete the service & ingress, as the job will delete it
# kubectl delete service "$projectId" -n replit-app
# kubectl delete ingress "$projectId" -n replit-app

# Check if the commands were successful
if [ $? -eq 0 ]; then
  echo "Successfully deleted resources for projectId: $projectId"
else
  echo "Failed to delete resources for projectId: $projectId"
fi