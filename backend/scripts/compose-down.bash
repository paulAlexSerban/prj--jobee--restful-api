#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

source ../.env

echo " 🛑  STOP 🐳 ${FORMTED_PROJECT_NAME}"
docker-compose --env-file ../.env.common \
  --file ../docker-compose.dev.yml \
 down
