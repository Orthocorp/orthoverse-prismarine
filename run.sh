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

cd flying-squid
x-terminal-emulator -e "bash -c 'node examples/orthoverse.js; $SHELL'"
cd ../prismarine-web-client
x-terminal-emulator -e "bash -c 'npm start; $SHELL'"
