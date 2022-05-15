#!/usr/bin/env bash

# Bash script to build Prismarine Minecraft world for the orthoverse
# Get correct version of node
if [[ ! -f ~/.nvm/nvm.sh ]]
then
  curl https://raw.github.com/creationix/nvm/master/install.sh | sh
fi
. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
nvm install 16
echo "Node version: $(node --version)"


# uncomment for debug info
set -x

# Copy the latest version
cp -r ./patch-files/prismarine-web-client ./
cp -r ./patch-files/flying-squid ./

cd ./flying-squid
osascript -e "tell application \"Terminal\" to do script \"cd '$(pwd)' && bash -c 'node examples/orthoverse.js'\""

cd ../prismarine-web-client
osascript -e "tell application \"Terminal\" to do script \"cd '$(pwd)' && bash -c 'npm start'\""


