const Vec3 = require('vec3').Vec3;
const voxel = require('../../map-data/voxel.json');
const ethUtils = require('ethereumjs-util');

module.exports.player = function(player, serv) { 

  let xStor = 0
  let zStor = 0
  let yStor = 0
  let xCoord = 0
  let zCoord = 0

  function landCoord(m) {
    return (Math.floor(m / 96))
  }

  player._client.on('ethereum', (msg) => {
    // serv.info('Player ethereum channel message received:' , msg)
    // serv.info('Current challenge is: \n', player.ethereum.challenge)
    if (msg.slice(0,5) === 'chal:') {
      const prefix = "\x19Ethereum Signed Message:\n" // EIP-191 personal_sign prefix
      const challenge = prefix + player.ethereum.challenge.length + player.ethereum.challenge
      const response = msg.slice(5)
      const challengeHash = ethUtils.keccak(Buffer.from(challenge, "utf-8"))
      const {v, r, s} = ethUtils.fromRpcSig(response)
      const pubKey = ethUtils.ecrecover(ethUtils.toBuffer(challengeHash), v, r, s)
      const addrBuf = ethUtils.pubToAddress(pubKey)
      const addr = ethUtils.bufferToHex(addrBuf)
      if (addr.length === 42) {
        serv.info('Confirmed ' + player.username + ' controls ' + addr)
        player.ethereum.wallet = addr
        player.ethereum.confirmed = true
        player._client.writeChannel('ethereum', 'wack:' + addr)
      }
    }
  })

  // store initial starting position
  player.on('spawn', () => {

  })

  player.on('move', ({position}, cancelled) => {
    // only act on Ethereum events if the player has verified their address
    if (player.ethereum.confirmed === true) {

      // check whether player has moved onto a new tile
      if ((xCoord != landCoord(player.position.x)) || (zCoord != landCoord(player.position.z))) {
        xCoord = landCoord(xStor)
        zCoord = landCoord(zStor)
        // we have moved into a new tile
        const landPos = xCoord.toString() + ":" + zCoord.toString()
        if (landPos in voxel) {
          const landOwner = voxel[landPos][4]
          if (player.ethereum.wallet === landOwner) {
            player._client.writeChannel('ethereum', "ownd:true")
          } else {
             player._client.writeChannel('ethereum', "ownd:false")         
          }
        } else { player._client.writeChannel('ethereum', "ownd:false") }
      }

      xStor = player.position.x;
      zStor = player.position.z;
      yStor = player.position.y;
    }

  })

}



