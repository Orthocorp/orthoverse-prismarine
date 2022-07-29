const Vec3 = require('vec3').Vec3;

module.exports.player = function(player, serv) { 

  // make spawn a bit higher
  player.on('spawn', () => {
    let xStor = player.position.x;
    let zStor = player.position.z;
    let yStor = player.position.y;
    player.teleport(new Vec3(xStor, yStor + 10, zStor))
  })

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
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }
        // south
        if (((Math.floor(xStor) === 47+x) || (Math.floor(xStor) === 48+x)) &&     
            (Math.floor(zStor) === 63+z)) {
          zStor = zStor - 15.5 + jump;
          if (zStor > 3000) {zStor = zStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }
        // west
        if (((Math.floor(zStor) === 47+z) || (Math.floor(zStor) === 48+z)) &&     
            (Math.floor(xStor) === 32+x)) {
          xStor = xStor + 15.5 - jump;
          if (xStor < -3000) {xStor = xStor + 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }
        // east
        if (((Math.floor(zStor) === 47+z) || (Math.floor(zStor) === 48+z)) &&     
            (Math.floor(xStor) === 63+x)) {
          xStor = xStor -15.5 + jump;
          if (xStor > 3000) {xStor = xStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }

        // northwest
        if (((Math.floor(xStor) === 36+x) && (Math.floor(zStor) === 36+z)) ||     
            ((Math.floor(xStor) === 37+x) && (Math.floor(zStor) === 37+z))) {
          zStor = zStor + 15.5 - jump;
          xStor = xStor + 15.5 - jump;
          if (zStor < - 3000 ) {zStor = zStor + 3*jump}
          if (xStor < -3000 ) {xStor = xStor + 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }
        // southwest
        if (((Math.floor(xStor) === 36+x) && (Math.floor(zStor) === 59+z)) ||     
            ((Math.floor(xStor) === 37+x) && (Math.floor(zStor) === 58+z))) {
          zStor = zStor - 15.5 + jump;
          xStor = xStor + 15.5 - jump;
          if (zStor > 3000 ) {zStor = zStor - 3*jump}
          if (xStor < -3000 ) {xStor = xStor + 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }

        // northeast
        if (((Math.floor(xStor) === 58+x) && (Math.floor(zStor) === 37+z)) ||     
            ((Math.floor(xStor) === 59+x) && (Math.floor(zStor) === 36+z))) {
          zStor = zStor + 15.5 - jump;
          xStor = xStor - 15.5 + jump;
          if (zStor < -3000 ) {zStor = zStor + 3*jump}
          if (xStor > 3000 ) {xStor = xStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }
        // southeast
        if (((Math.floor(xStor) === 58+x) && (Math.floor(zStor) === 58+z)) ||     
            ((Math.floor(xStor) === 59+x) && (Math.floor(zStor) === 59+z))) {
          zStor = zStor - 15.5 + jump;
          xStor = xStor - 15.5 + jump;
          if (zStor > 3000 ) {zStor = zStor - 3*jump}
          if (xStor > 3000 ) {xStor = xStor - 3*jump}
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor));
          z = x = jump + 1;
        }

      }
    }
  })

}



