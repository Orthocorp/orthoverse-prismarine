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

cp -r ./patch-files/prismarine-web-client ./
cp -r ./patch-files/flying-squid ./
cd ./flying-squid/world
rm -fr *
cd ..
node ./examples/orthoverse.js

