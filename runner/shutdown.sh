#!/bin/bash

# ! if inactive for more than 10 minutes, terminate the Job which terminates the pod, service, and ingress
INACTIVITY_TIMEOUT=600 # 10 minutes in seconds
# INACTIVITY_TIMEOUT=60 # 1 minute in seconds

# Function to check for inactivity
check_inactivity() {
  while true; do
    echo "Trying to check for inactivity!!!"

    # Find the most recently modified file or directory inside /home/abc/workspace
    activity1=$(stat -c %Y /home/abc/workspace)
    activity2=$(find /home/abc/workspace -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f1 | cut -d'.' -f1)

    difference1=$(($(date +%s) - ${activity1}))
    difference2=$(($(date +%s) - ${activity2}))

    echo "Last activity1: $(($difference1))"
    echo "Last activity2: $(($difference2))"

    if [ $difference1 -ge $INACTIVITY_TIMEOUT ] && [ $difference2 -ge $INACTIVITY_TIMEOUT ]; then
      echo "No activity detected for $INACTIVITY_TIMEOUT seconds. Shutting down."
      # TODO: Adjust this to your server process if needed (Ex. java)
      pkill -f "node" 
      pkill -f "python3"
      exit 0
    fi

    # ! check for inactivity every 60 seconds
    echo "Activity detected. Sleeping for 60 seconds."
    sleep 60
  done
}

# Update last activity time on any activity
check_inactivity &
exec "$@"