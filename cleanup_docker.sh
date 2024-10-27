#!/bin/bash

# Find all image IDs of "rohitshah1706/replit_runner" except for the "latest" tag
images_to_remove=$(docker images --format "{{.ID}} {{.Repository}}:{{.Tag}}" | grep 'rohitshah1706/replit_runner' | grep -v ':latest' | awk '{print $1}')

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
