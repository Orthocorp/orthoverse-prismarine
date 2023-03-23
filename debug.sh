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

# rm -fr ./prismarine-web-client/node_modules/prismarine-viewer/public/textures/*
cp -r ./patch-files/prismarine-web-client ./
cp -r ./patch-files/flying-squid ./

rm -fr ./flying-squid/world/*

cd flying-squid
# artificially put system in the past to trigger updates after off-line time
sed -i 's/"timestamp":[0-9]\+/"timestamp":164879251000/g' ./land-saves/doxel.json
node ./examples/orthoverse.js

