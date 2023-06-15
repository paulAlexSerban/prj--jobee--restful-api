#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

# Usage: ./check_docker_container.sh _container_id_
#
# Edited by: Paulo José de Oliveira Salgado
# Email: paulo@technosoftware.com.br
#
# Depending on your docker configuration, root might be required. If your nrpe user has rights
# to talk to the docker daemon, then root is not required. This is why root privileges are not
# checked.
#
# The script checks if a container is running.
#   OK - running
#   WARNING - restarting
#   CRITICAL - stopped
#   UNKNOWN - does not exist

CONTAINER=$1

if [ "${CONTAINER}" == "" ]; then
  echo "🛑 3 - UNKNOWN" 
  echo "🛑 Container ID or Friendly Name Required"
  exit 3
fi

if [ "$(which docker)" == "" ]; then
  echo "🛑 3 - UNKNOWN" 
  echo "🛑 Missing docker binary"
  exit 3
fi

docker info > /dev/null 2>&1
# shellcheck disable=SC2181
if [ $? -ne 0 ]; then
  echo "🛑 3 - UNKNOWN" 
  echo "🛑 Unable to talk to the docker daemon"
  exit 3
fi

RUNNING=$(docker inspect --format="{{.State.Running}}" "$CONTAINER" 2> /dev/null)

if [ $? -eq 1 ]; then
  echo "🛑 3 - UNKNOWN"
  echo "🛑 $CONTAINER does not exist."
  exit 3
fi

if [ "$RUNNING" == "false" ]; then
  echo "2 - CRITICAL" 
  echo "$CONTAINER is not running."
  exit 2
fi

RESTARTING=$(docker inspect --format="{{.State.Restarting}}" "$CONTAINER")

if [ "$RESTARTING" == "true" ]; then
  echo "1 - WARNING" 
  echo "$CONTAINER state is restarting."
  exit 1
fi

STARTED=$(docker inspect --format="{{.State.StartedAt}}" "$CONTAINER")
NETWORK=$(docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" "$CONTAINER")

echo "🟢 0 - RUNNING OK"
echo "🟢 $CONTAINER is running."
echo "🟢 -> IP: $NETWORK"
echo "🟢 Started at: $STARTED"
