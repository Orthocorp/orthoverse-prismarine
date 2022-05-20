const mcServer = require('flying-squid')
const Vec3 = require('vec3').Vec3;

const serv = mcServer.createMCServer({
  motd: 'The Orthoverse \nProvided by Flying Squid',
  port: 20565,
  'max-players': 10,
  'online-mode': false,
  logging: true,
  gameMode: 2,
  difficulty: 1,
  worldFolder: 'world',
  generation: {
    name: 'orthogen',
    options: {
      seed: 100,
      version: '1.15.2'
    }
  },
  kickTimeout: 10000,
  plugins: {

  },
  modpe: false,
  'view-distance': 10,
  'player-list-text': {
    header: 'Orthoverse',
    footer: 'Voxel World'
  },
  'everybody-op': true,
  'max-entities': 100,
  version: '1.15.2'
})

// teleport check
setInterval(function() {
  if (serv.players) {
    serv.players.forEach((player, i) => {
      //orthohenge
      // north
      if (((Math.floor(player.position.x) === 47) || (Math.floor(player.position.x) == 48)) &&   
          (Math.floor(player.position.z) === 32)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5 - 30*6*16));
      }
      // south
      if (((Math.floor(player.position.x) === 47) || (Math.floor(player.position.x) == 48)) &&   
          (Math.floor(player.position.z) === 63)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5 + 30*6*16));
      }
      // west
      if (((Math.floor(player.position.z) === 47) || (Math.floor(player.position.z) == 48)) &&   
          (Math.floor(player.position.x) === 32)) {
        player.teleport(new Vec3(47.5 - 30*6*16, player.position.y + 1, 47.5));
      }
      // east
      if (((Math.floor(player.position.z) === 47) || (Math.floor(player.position.z) == 48)) &&   
          (Math.floor(player.position.x) === 63)) {
        player.teleport(new Vec3(47.5 + 30*6*16, player.position.y + 1, 47.5));
      }
      // and back
      // north
      if (((Math.floor(player.position.x) === 47) || (Math.floor(player.position.x) == 48)) &&   
          (Math.floor(player.position.z) === 63 - 30*6*16)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5));
      }
      // south
      if (((Math.floor(player.position.x) === 47) || (Math.floor(player.position.x) == 48)) &&   
          (Math.floor(player.position.z) === 32 + 30*6*16)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5));
      }
      // west
      if (((Math.floor(player.position.z) === 47) || (Math.floor(player.position.z) == 48)) &&   
          (Math.floor(player.position.x) === 63 - 30*6*16)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5));
      }
      // east
      if (((Math.floor(player.position.z) === 47) || (Math.floor(player.position.z) == 48)) &&   
          (Math.floor(player.position.x) === 32 + 30*6*16)) {
        player.teleport(new Vec3(47.5, player.position.y + 1, 47.5));
      }
    });
  }
}, 200)

