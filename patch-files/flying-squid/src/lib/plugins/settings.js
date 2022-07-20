const Vec3 = require('vec3').Vec3

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

module.exports.server = function (serv, settings) {
  serv.gameMode = settings.gameMode
  serv.difficulty = settings.difficulty
  const mcData = require('minecraft-data')(settings.version)

  const waterBlocks = new Set([mcData.blocksByName.water.id])
  if (mcData.blocksByName.flowing_water !== undefined) {
    waterBlocks.add(mcData.blocksByName.flowing_water.id)
  }

  async function findSpawnZone (world, initialPoint) {
    let point = initialPoint
    while ((await (world.getBlockType(point))) === 0) { point = point.offset(0, -1, 0) }
    while (true) {
      const p = await world.getBlockType(point)
      if (!waterBlocks.has(p)) { break }
      point = point.offset(1, 0, 0)
    }
    while ((await world.getBlockType(point)) !== 0) { point = point.offset(0, 1, 0) }

    return point
  }

  serv.getSpawnPoint = async (world) => {
    let south = 0
    let east = 0
    const compass = randomInt(0,4)
    switch (compass) {
      case 0: // north
        east = 32
        break
      case 1: // east
        south = 32
        east = 64
        break
      case 2: // west
        south = 32
        break
      case 3: // south
        east = 32
        south = 64
        break
    }
    return findSpawnZone(world, new Vec3(randomInt(0,31) + (east), 81, randomInt(0, 31) + (south)))
  }
}

module.exports.player = async function (player, serv) {
  player.prevGameMode = 255
  player.gameMode = serv.gameMode
  player.findSpawnPoint = async () => {
    player.spawnPoint = await serv.getSpawnPoint(player.world)
    console.log("Spawning to : ", player.spawnPoint)
  }
  player._client.on('settings', ({ viewDistance }) => {
    player.view = viewDistance
  })
}
