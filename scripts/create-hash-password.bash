#!/bin/bash

# makes sure the folder containing the script will be the root folder
cd "$(dirname "$0")" || exit

# create hash password
USERNAME="username"
PASSWORD="password"
htpasswd -nb $USERNAME $PASSWORD | sed -e s/\\$/\\$\\$/g