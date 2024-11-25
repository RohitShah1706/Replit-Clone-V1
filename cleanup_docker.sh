#!/bin/bash

# Check if image is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <image>"
  exit 1
fi

# Assign the first argument to image
image=$1

# Find all image IDs of "rohitshah1706/replit_runner" except for the "latest" tag
images_to_remove=$(docker images --format "{{.ID}} {{.Repository}}:{{.Tag}}" | grep $image | grep -v ':latest' | awk '{print $1}')

# Check if there are any images to remove
if [ -z "$images_to_remove" ]; then
  echo "No images found to remove, except for the latest."
else
  echo "Images to remove:"
  echo "$images_to_remove"

  # Loop through each image ID and remove it
  for image_id in $images_to_remove; do
    echo "Removing image with ID: $image_id"
    docker rmi "$image_id"
  done
fi
