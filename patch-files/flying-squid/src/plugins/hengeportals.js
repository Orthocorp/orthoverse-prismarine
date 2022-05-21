const Vec3 = require('vec3').Vec3;

// teleport check

module.exports.player = function(player, serv) { 

  player.on('move', ({position}, cancelled) => { 
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
  })

}



