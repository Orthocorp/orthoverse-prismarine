const ethUtils = require('ethereumjs-util')
const Vec3 = require('vec3').Vec3

module.exports.player = function (player, serv) {
  let xStor = 0
  let zStor = 0
  let yStor = 0
  let xCoord = 0
  let zCoord = 0

  // this converts an in-world x or z coordinate into a land coordinate
  function landCoord (m) {
    return (Math.floor(m / 96))
  }

  // this returns the top-left block coordinate given a land position
  function landCorner (landX, landZ) {
    return [Math.floor(landX * 96), Math.floor(landZ * 96)]
  }

  // to prevent more than one save every 10 minutes for level 1
  // every level greater than 1 makes this 1 minutes shorter)
  function timeLimit (lvl) {
    if ('saveTimeLimit' in player.ethereum) {
      if (player.ethereum.saveTimeLimit + 660 - (lvl * 60)  < Math.floor(Date.now() / 1000) ) {
        player.ethereum.saveTimeLimit = Math.floor(Date.now() / 1000)
        return true
      } else {
        return false
      }
    } else {
      player.ethereum.saveTimeLimit = Math.floor(Date.now() / 1000)
      return true
    }  
  }


  // store initial starting position: turns out it's not needed.
  player.on('spawn', () => {

  })

  player.on('move', ({ position }, cancelled) => {
    // only act on Ethereum events if the player has verified their address
    if (player.ethereum.confirmed === true) {
      // check whether player has moved onto a new land
      if ((xCoord !== landCoord(player.position.x)) || (zCoord !== landCoord(player.position.z))) {
        xCoord = landCoord(xStor)
        zCoord = landCoord(zStor)
        // we have moved into a new land
        const landKey = xCoord.toString() + ':' + zCoord.toString()
        if (landKey in serv.voxel.data) {
          const landOwner = serv.voxel.data[landKey][4]
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
    // serv.info('Player ethereum channel message received:' , msg)

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
      console.log('Location is ' +
                   player.position.x + ',' + 
                   player.position.y + ',' + 
                   player.position.z)
      player.teleport(player.spawnPoint)
      // console.log("Landing block: " + player.blockAt(new Vec3(xStor, yStor - 1, zStor)))
    }

    // *********************************************
    // This section handles the saving of the land the player is standing on
    // *********************************************
    if (msg.slice(0, 5) === 'save:') {
      const slot = msg.slice(-1)
      // check what land the player is standing in
      const landX = landCoord(player.position.x)
      const landZ = landCoord(player.position.z)
      const landKey = landX.toString() + ':' + landZ.toString()
      if (landKey in serv.voxel.data) {
        const landOwner = serv.voxel.data[landKey][4]
        // check the player owns it
        if (player.ethereum.wallet !== landOwner){
          player._client.writeChannel('ethereum', 'mesg:You cannot save a land you do not own')
          return
        }
      } else { 
        player._client.writeChannel('ethereum', 'mesg:How odd. I cannot find the owner of this land')
        return
      }
      // check that the save slot is within the level of the land
      if (serv.voxel.data[landKey][2] % 8 === 0) {
        player._client.writeChannel('ethereum', 
          'mesg:Save is only available for levels 1 or more'
        )
        return
      }
      if (player.username !== 'BCGandalf') {
        if (timeLimit(serv.voxel.data[landKey][2] % 8) === false) {
          player._client.writeChannel('ethereum',
            'mesg:You can only save or load land once every ' + 
             ((660 - ((serv.voxel.data[landKey][2] % 8) * 60))/60).toString() + 
             ' minutes to stop spammers overloading the server'
          )
          return
        }
      }
      if (serv.voxel.data[landKey][2] % 8 < slot) {
        player._client.writeChannel('ethereum', 
          'mesg:Your land is level ' + 
          (serv.voxel.data[landKey][2] % 8).toString() + 
          ' so save/load slot ' + slot.toString() + 
          ' is not available.'
        )
        return     
      }

      const result = serv.voxel.saveLand(slot, landX, landZ)
      player._client.writeChannel('ethereum', result)

    }

    // *********************************************
    // this is where we load a previously saved land
    // *********************************************
    if (msg.slice(0, 5) === 'load:') {
      const slot = msg.slice(-1)
      player._client.writeChannel('ethereum', 'mesg:' + 'Trying to load slot ' + slot)
      // check what land the player is standing in
      const landX = landCoord(player.position.x)
      const landZ = landCoord(player.position.z)
      const landKey = landX.toString() + ':' + landZ.toString()
      if (landKey in serv.voxel.data) {
        const landOwner = serv.voxel.data[landKey][4]
        // check the player owns it
        if (player.ethereum.wallet !== landOwner) { 
          player._client.writeChannel('ethereum', 'mesg:You cannot load a land you do not own')
          return
        }
      } else { 
        player._client.writeChannel('ethereum', 'mesg:How odd. I cannot find the owner of this land')
        return
      }
      // check that the save slot is within the level of the land
      if (serv.voxel.data[landKey][2] % 8 === 0) {
        player._client.writeChannel('ethereum', 
          'mesg:Load is only available for levels 1 or more'
        )
        return     
      }
      if (player.username !== 'BCGandalf') {
        if (timeLimit(serv.voxel.data[landKey][2] % 8) === false) {
          player._client.writeChannel('ethereum',
            'mesg:You can only save or load land once every ' + 
             ((660 - ((serv.voxel.data[landKey][2] % 8) * 60))/60).toString() + 
             ' minutes to stop spammers overloading the server'
          )
          return
        }
      }
      if (serv.voxel.data[landKey][2] % 8 < slot) {
        player._client.writeChannel('ethereum', 
          'mesg:Your land is level ' + 
          (serv.voxel.data[landKey][2] % 8).toString() + 
          ' so save/load slot ' + 
          slot.toString() + 
          ' is not available.'
        )
        return     
      }

      const result = serv.voxel.loadLand(slot, landX, landZ)
      player._client.writeChannel('ethereum', result)

    }

  })

}
