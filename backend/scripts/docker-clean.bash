#!/bin/bash
# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

echo " 🛑  CLEAN 🐳  Docker and clean containers"
docker container prune -f
docker volume prune -f
docker image prune -af
rm -rfv ../database/.tmp-data