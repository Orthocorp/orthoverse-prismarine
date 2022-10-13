const Vec3 = require('vec3').Vec3

module.exports.player = function (player, serv) {
  // make spawn a bit higher - but it doesn't work
  /* player.on('spawn', () => {
    console.log("Player spawned")
    const xStor = player.position.x
    const zStor = player.position.z
    const yStor = player.position.y
    // player.teleport(new Vec3(xStor, yStor + 10, zStor))
  }) */

  player.on('move', ({ position }, cancelled) => {
    let xStor = player.position.x
    let yStor = player.position.y
    let zStor = player.position.z
  // TODO: am i in the ground?
    // console.log("Landing block: " + player.blockAt(new Vec3(xStor, yStor - 1, zStor)))
    // const mykeys = Object.keys(player.world)
    // for (i = 0; i < mykeys.length; i++) {console.log(mykeys[i])}

  // orthohenge
    const jump = 30 * 6 * 16 // 2880

    for (let x = -jump; x <= jump; x = x + jump) {
      for (let z = -jump; z <= jump; z = z + jump) {
        // north
        if (((Math.floor(xStor) === 47 + x) || (Math.floor(xStor) === 48 + x)) &&
            (Math.floor(zStor) === 32 + z)) {
          zStor = zStor + 15.5 - jump
          if (zStor < -3000) { zStor = zStor + 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
        // south
        if (((Math.floor(xStor) === 47 + x) || (Math.floor(xStor) === 48 + x)) &&
            (Math.floor(zStor) === 63 + z)) {
          zStor = zStor - 15.5 + jump
          if (zStor > 3000) { zStor = zStor - 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
        // west
        if (((Math.floor(zStor) === 47 + z) || (Math.floor(zStor) === 48 + z)) &&
            (Math.floor(xStor) === 32 + x)) {
          xStor = xStor + 15.5 - jump
          if (xStor < -3000) { xStor = xStor + 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
        // east
        if (((Math.floor(zStor) === 47 + z) || (Math.floor(zStor) === 48 + z)) &&
            (Math.floor(xStor) === 63 + x)) {
          xStor = xStor - 15.5 + jump
          if (xStor > 3000) { xStor = xStor - 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }

        // northwest
        if (((Math.floor(xStor) === 36 + x) && (Math.floor(zStor) === 36 + z)) ||
            ((Math.floor(xStor) === 37 + x) && (Math.floor(zStor) === 37 + z))) {
          zStor = zStor + 15.5 - jump
          xStor = xStor + 15.5 - jump
          if (zStor < -3000) { zStor = zStor + 3 * jump }
          if (xStor < -3000) { xStor = xStor + 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
        // southwest
        if (((Math.floor(xStor) === 36 + x) && (Math.floor(zStor) === 59 + z)) ||
            ((Math.floor(xStor) === 37 + x) && (Math.floor(zStor) === 58 + z))) {
          zStor = zStor - 15.5 + jump
          xStor = xStor + 15.5 - jump
          if (zStor > 3000) { zStor = zStor - 3 * jump }
          if (xStor < -3000) { xStor = xStor + 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }

        // northeast
        if (((Math.floor(xStor) === 58 + x) && (Math.floor(zStor) === 37 + z)) ||
            ((Math.floor(xStor) === 59 + x) && (Math.floor(zStor) === 36 + z))) {
          zStor = zStor + 15.5 - jump
          xStor = xStor - 15.5 + jump
          if (zStor < -3000) { zStor = zStor + 3 * jump }
          if (xStor > 3000) { xStor = xStor - 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
        // southeast
        if (((Math.floor(xStor) === 58 + x) && (Math.floor(zStor) === 58 + z)) ||
            ((Math.floor(xStor) === 59 + x) && (Math.floor(zStor) === 59 + z))) {
          zStor = zStor - 15.5 + jump
          xStor = xStor - 15.5 + jump
          if (zStor > 3000) { zStor = zStor - 3 * jump }
          if (xStor > 3000) { xStor = xStor - 3 * jump }
          player.teleport(new Vec3(xStor, player.position.y + 2, zStor))
          z = x = jump + 1
        }
      }
    }
  })
}
