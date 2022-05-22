const Vec3 = require('vec3').Vec3;

// teleport check

module.exports.player = function(player, serv) { 

  player.on('move', ({position}, cancelled) => { 
  //orthohenge
    const jump = 30*6*16; // 2880
    let xStor = player.position.x;
    let zStor = player.position.z;

    for (let x=-jump; x<=jump;x=x+jump) {
      for (let z=-jump; z<=jump;z=z+jump) {
        // north
        if (((Math.floor(xStor) === 47+x) || (Math.floor(xStor) === 48+x)) &&     
            (Math.floor(zStor) === 32+z)) {
          zStor = zStor + 15.5 - jump;
          if (zStor < -3000 ) {zStor = zStor + 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 1.5, zStor));
          z = x = jump + 1;
        }
        // south
        if (((Math.floor(xStor) === 47+x) || (Math.floor(xStor) === 48+x)) &&     
            (Math.floor(zStor) === 63+z)) {
          zStor = zStor - 15.5 + jump;
          if (zStor > 3000) {zStor = zStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 1.5, zStor));
          z = x = jump + 1;
        }
        // west
        if (((Math.floor(zStor) === 47+z) || (Math.floor(zStor) === 48+z)) &&     
            (Math.floor(xStor) === 32+x)) {
          xStor = xStor + 15.5 - jump;
          if (xStor < -3000) {xStor = xStor + 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 1.5, zStor));
          z = x = jump + 1;
        }
        // east
        if (((Math.floor(zStor) === 47+z) || (Math.floor(zStor) === 48+z)) &&     
            (Math.floor(xStor) === 63+x)) {
          xStor = xStor -15.5 + jump;
          if (xStor > 3000) {xStor = xStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 1.5, zStor));
          z = x = jump + 1;
        }
      }
    }
  })

}



