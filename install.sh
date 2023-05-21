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

git clone https://github.com/PrismarineJS/flying-squid.git
# pwc now lives in gitlab
git clone https://gitlab.com/PrismarineJS/prismarine-web-client.git
cp -r ./patch-files/prismarine-web-client ./
cp -r ./patch-files/flying-squid ./

cd flying-squid
npm install
cd ../prismarine-web-client
npm install
cd ..

