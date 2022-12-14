const voxel = require('../../map-data/voxel.json')
const ethUtils = require('ethereumjs-util')
const Vec3 = require('vec3').Vec3
const Chunk = require('prismarine-chunk')('1.15.2')
const fse = require('fs-extra')
const fs = require('fs')


module.exports.player = function (player, serv) {
  let xStor = 0
  let zStor = 0
  let yStor = 0
  let xCoord = 0
  let zCoord = 0

  // this converts an in-world x or z coordinate into a land tile coordinate
  function landCoord (m) {
    return (Math.floor(m / 96))
  }

  // this returns the top-left block coordiante given a tile position
  function tileCorner (lat, long) {
    return [Math.floor(lat * 96), Math.floor(long * 96)]
  }

  // store initial starting position: turns out it's not needed.
  player.on('spawn', () => {

  })


  player.on('move', ({ position }, cancelled) => {
    // only act on Ethereum events if the player has verified their address
    if (player.ethereum.confirmed === true) {
      // check whether player has moved onto a new tile
      if ((xCoord !== landCoord(player.position.x)) || (zCoord !== landCoord(player.position.z))) {
        xCoord = landCoord(xStor)
        zCoord = landCoord(zStor)
        // we have moved into a new tile
        const landPos = xCoord.toString() + ':' + zCoord.toString()
        if (landPos in voxel) {
          const landOwner = voxel[landPos][4]
          if (player.ethereum.wallet === landOwner) {
            player._client.writeChannel('ethereum', 'ownd:true')
          } else {
            player._client.writeChannel('ethereum', 'ownd:false')
          }
        } else { player._client.writeChannel('ethereum', 'ownd:false') }
      }

      xStor = player.position.x
      zStor = player.position.z
      yStor = player.position.y
    }
  })

  player._client.on('ethereum', (msg) => {
    serv.info('Player ethereum channel message received:' , msg)

    // This section handles the ethereum address signing challenge/response
    if (msg.slice(0, 5) === 'chal:') {
      const prefix = '\x19Ethereum Signed Message:\n' // EIP-191 personal_sign prefix
      console.log("Challenge is:")
      console.log(player.ethereum.challenge)
      const challenge = prefix + player.ethereum.challenge.length + player.ethereum.challenge
      const response = msg.slice(5)
      const challengeHash = ethUtils.keccak(Buffer.from(challenge, 'utf-8'))
      console.log("Challenge hash: ", challengeHash)
      const { v, r, s } = ethUtils.fromRpcSig(response)
      const pubKey = ethUtils.ecrecover(ethUtils.toBuffer(challengeHash), v, r, s)
      const addrBuf = ethUtils.pubToAddress(pubKey)
      const addr = ethUtils.bufferToHex(addrBuf)
      if (addr.length === 42) {
        serv.info('Confirmed ' + player.username + ' controls ' + addr)
        player.ethereum.wallet = addr
        player.ethereum.confirmed = true
        player._client.writeChannel('ethereum', 'wack:' + addr)
      }
    }

    // This section handles teleporting back to the Orthohenge
    if (msg.slice(0, 5) === 'home!') {
      console.log('Player wants to teleport home')
      console.log('Location is ' + player.position.x + ',' + player.position.y + ',' + player.position.z)
      player.teleport(player.spawnPoint)
      // console.log("Landing block: " + player.blockAt(new Vec3(xStor, yStor - 1, zStor)))
    }

    // This section handles the saving of the land the player is standing on
    if (msg.slice(0, 5) === 'save:') {
      console.log('Save request is ' + msg.slice(5))
      console.log('Location is ' + player.position.x + ',' + player.position.y + ',' + player.position.z)
      const slot = msg.slice(-1)
      // player._client.writeChannel('ethereum', 'mesg:' + 'Trying to save slot ' + slot)
      // check what land the player is standing in
      const long = landCoord(player.position.x)
      const lat = landCoord(player.position.z)
      const landPos = long.toString() + ':' + lat.toString()
      console.log("Trying to save land at " + landPos)
      if (landPos in voxel) {
        const landOwner = voxel[landPos][4]
        // check the player owns it
        if (player.ethereum.wallet === landOwner){
          player._client.writeChannel('ethereum', 'mesg:You own this land')
        } else { 
          player._client.writeChannel('ethereum', 'mesg:You cannot save a land you do not own')
          return
        }
      } else { 
        player._client.writeChannel('ethereum', 'mesg:How odd. I cannot find the owner of this land')
        return
      }
      // check that the save slot is within the level of the land
      if (voxel[landPos][2] % 8 < slot) {
        player._client.writeChannel('ethereum', 
          'mesg:Your land is level ' + 
          (voxel[landPos][2] % 8).toString() + 
          ' so save/load slot ' + slot.toString() + 
          ' is not available.'
        )
        return     
      }
      // now we are ready to save that land into a file
      // file name format: <slot>-<realm>.lnd
      // Note that the region files containing the land data are in
      // *.mca files in flying-squid/world/region/
      // we save individual player builds in flying-squid/world/region/builds/<land-address>/
      const savePath = './land-saves/region/' + voxel[landPos][0] + '/'
      console.log("savePath is " + savePath)
      // check if land save folder exists and make it if it doesn't
      fse.ensureDirSync(savePath)
      const saveFileName = slot.toString() + '-' + voxel[landPos][2]

      // mca stands for minecraft anvil region
      // a chunk is a 16x256x16 column of data. An Orthoverse land is a 96 block wide square, 
      // making it a 6 by 6 collection of chunks
      // so to save a land we just need to save an array of 6x6 = 36 chunks

      let bitmapObj = {}

      for (let chunkZ = lat * 6; chunkZ < (lat * 6) + 6; chunkZ++) { 
        for (let chunkX = long * 6; chunkX < (long * 6) + 6; chunkX++) { 

          let chunkDump
          console.log("Trying to save chunk " + chunkX.toString() + ":" + chunkZ.toString())
          try {
            const chunk = serv.overworld.sync.getColumn(chunkX, chunkZ)
            chunkDump = chunk.dump()
            bitmapObj[chunkX.toString() + ':' + chunkZ.toString()] = chunk.getMask()
          } catch (e) {
            player._client.writeChannel('ethereum', 'mesg:Error chunk: ' + e)
          }

          try {
            fs.writeFileSync(savePath + chunkX.toString() + 
              '.' + chunkZ.toString() + 
              '.' + saveFileName + ".lnd",
              chunkDump
            )
          } catch (e) {
            player._client.writeChannel('ethereum', 'mesg:Error saving: ' + e)
          }
        }
      }
      fs.writeFileSync(savePath + "bitmap-" + saveFileName + ".json", JSON.stringify(bitmapObj), 'utf-8')
      player._client.writeChannel('ethereum', 'mesg:Saved current state of ' + voxel[landPos][1])

    }


    // this is where we load a previously saved land
    if (msg.slice(0, 5) === 'load:') {
      console.log('Load request is ' + msg.slice(5))
      console.log('Location is ' + player.position.x + ',' + player.position.y + ',' + player.position.z)
      const slot = msg.slice(-1)
      player._client.writeChannel('ethereum', 'mesg:' + 'Trying to load slot ' + slot)
      // check what land the player is standing in
      const long = landCoord(player.position.x)
      const lat = landCoord(player.position.z)
      const landPos = long.toString() + ':' + lat.toString()
      if (landPos in voxel) {
        const landOwner = voxel[landPos][4]
        // check the player owns it
        if (player.ethereum.wallet === landOwner) {
          player._client.writeChannel('ethereum', 'mesg:You own this land')
        } else { 
          player._client.writeChannel('ethereum', 'mesg:You cannot load a land you do not own')
          return
        }
      } else { 
        player._client.writeChannel('ethereum', 'mesg:How odd. I cannot find the owner of this land')
        return
      }
      // check that the save slot is within the level of the land
      if (voxel[landPos][2] % 8 < slot) {
        player._client.writeChannel('ethereum', 
          'mesg:Your land is level ' + 
          (voxel[landPos][2] % 8).toString() + 
          ' so save/load slot ' + 
          slot.toString() + 
          ' is not available.'
        )
        return     
      } 
      // check there is actually a land to load

      // now we are ready to load that land from a file
      const loadPath = './land-saves/region/' + voxel[landPos][0] + '/'
      // check if land save folder exists and exit if it doesn't
      const loadFileName = slot.toString() + '-' + voxel[landPos][2]
      let bitmapObj
      try {
        bitmapRaw = fs.readFileSync(loadPath + "bitmap-" + loadFileName + ".json", 'utf-8')
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
         player._client.writeChannel('ethereum', 'mesg:You cannot load an unsaved land.')
         return
      }


      for (let chunkZ = lat * 6; chunkZ < (lat * 6) + 6; chunkZ++) { 
        for (let chunkX = long * 6; chunkX < (long * 6) + 6; chunkX++) { 
          try {
            const chunkData = new Buffer.from(fs.readFileSync(loadPath + 
              chunkX.toString() + '.' + chunkZ.toString() + '.' + loadFileName + '.lnd'));
            const chunk = new Chunk()
            chunk.load(chunkData, bitmap=bitmapObj[chunkX + ':' + chunkZ])
            // set the new chunk
            serv.overworld.sync.setColumn(chunkX, chunkZ, chunk)
            // send the chunk to relevant players
            serv.reloadChunks(serv.overworld, [{chunkX, chunkZ}])
          } catch (e) {
            player._client.writeChannel('ethereum', 'mesg:Error loading: ' + e)
          }
        }
      }

      player._client.writeChannel('ethereum', 'mesg:Loaded new state for ' + voxel[landPos][1])

    }

  })

}
