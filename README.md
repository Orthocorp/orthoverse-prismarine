# orthoverse-prismarine
Pulls in [flying squid](https://github.com/PrismarineJS/flying-squid) (also known as fs) and [prismarine web client](https://github.com/PrismarineJS/prismarine-web-client) (also known as pwc), and runs a voxel world for the orthoverse.

Note that Orthoverse Prismarine requires an [Orthoverse Avatars](https://github.com/Orthocorp/orthoverse-avatars) server to be running as well, to provide the required skins data for players. This means you need to configure fs and pwc so they know where to send their API queries.

## Installation

Run the following:

```
git clone https://github.com/kf106/orthoverse-prismarine.git
cd orthoverse-prismarine
./install.sh
```

Then you need to edit the config files to point at the Orthoverse Avatars server.

pws: open `patch-files/prismarine-web-client/config.json` and change `"avatarAPI"`.

fs: open `patch-files/flying-squid/examples/orthoverse.js` and  change`"avatarAPI"` as well.


Finally, start the server and client with the following script:
```
./run.sh
```

To run the client and the server separately, run `debug.sh` from the main folder, and `npm run start` from the `prismarine-web-client` folder. 

## Connecting
Point your browser at [http://127.0.0.1:8082](http://127.0.0.1:8082) and have fun.
