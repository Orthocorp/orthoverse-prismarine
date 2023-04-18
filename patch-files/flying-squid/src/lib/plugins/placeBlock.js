const Vec3 = require('vec3').Vec3

const materialToSound = {
  undefined: 'stone',
  rock: 'stone',
  dirt: 'grass',
  plant: 'grass',
  wool: 'cloth',
  web: 'cloth',
  wood: 'wood'
}

let placing = false

module.exports.server = (serv, { version }) => {
  const mcData = require('minecraft-data')(version)

  const itemPlaceHandlers = new Map()
  serv.placeItem = (data) => {
    const handler = itemPlaceHandlers.get(data.item.type)
    return handler ? handler(data) : (serv.supportFeature('theFlattening') ? {} : { id: data.item.type, data: data.item.metadata })
  }

  /**
   * The handler is called when an item of the given type is
   * used to place a block. Arguments are the item, direction
   * and angle
   * It should return the id and data of the block to place
   */
  serv.onItemPlace = (name, handler, warn = true) => {
    let item = mcData.itemsByName[name]
    if (!item) item = mcData.blocksByName[name]
    if (itemPlaceHandlers.has(item.id) && warn) {
      serv.warn(`onItemPlace handler was registered twice for ${name}`)
    }
    itemPlaceHandlers.set(item.id, handler)
  }

  if (serv.supportFeature('theFlattening')) {
    const parseValue = (value, state) => {
      if (state.type === 'enum') {
        return state.values.indexOf(value)
      }
      if (state.type === 'bool') {
        return value ? 0 : 1
      }
      return parseInt(value, 10)
    }

    serv.setBlockDataProperties = (baseData, states, properties) => {
      let data = 0
      let offset = 1
      for (let i = states.length - 1; i >= 0; i--) {
        const prop = states[i]
        let value = baseData % prop.num_values
        baseData = Math.floor(baseData / prop.num_values)
        if (properties[prop.name]) {
          value = parseValue(properties[prop.name], prop)
        }
        data += offset * value
        offset *= prop.num_values
      }
      return data
    }

    // Register default handlers for item -> block conversion
    for (const name of Object.keys(mcData.itemsByName)) {
      const block = mcData.blocksByName[name]
      if (block) {
        if (block.states.length > 0) {
          serv.onItemPlace(name, ({ properties }) => {
            const data = block.defaultState - block.minStateId
            return { id: block.id, data: serv.setBlockDataProperties(data, block.states, properties) }
          })
        } else {
          serv.onItemPlace(name, () => {
            return { id: block.id, data: 0 }
          })
        }
      }
    }
  }

  const blockInteractHandler = new Map()
  serv.interactWithBlock = async (data) => {
    const handler = blockInteractHandler.get(data.block.type)
    return handler ? handler(data) : false
  }

  /**
   * The handler is called when a player interact with a block
   * of the given type. Arguments are the block and the player
   * It should return true if the block placement should be
   * cancelled.
   */
  serv.onBlockInteraction = (name, handler) => {
    const block = mcData.blocksByName[name]
    if (blockInteractHandler.has(block.id)) {
      serv.warn(`onBlockInteraction handler was registered twice for ${name}`)
    }
    blockInteractHandler.set(block.id, handler)
  }
}

module.exports.player = function (player, serv, { version }) {
  const QUICK_BAR_COUNT = 36
  const QUICK_BAR_START = 9
  const mcData = require('minecraft-data')(version)
  const blocks = mcData.blocks
  const specialPlace = {
      'dirt': ['grass', 8],
      'grass': ['dirt', 9], 
      'granite': ['white_concrete_powder', 429],
      'white_concrete_powder': ['white_concrete_powder_stairs', 884],
      'orange_concrete_powder_stairs': ['orange_concrete_powder', 430],
      'orange_concrete_powder': ['orange_concrete_powder_stairs', 681],
      'magenta_concrete_powder_stairs': ['magenta_concrete_powder', 431],
      'magenta_concrete_powder': ['magenta_concrete_powder_stairs', 682],
      'light_blue_concrete_powder_stairs': ['light_blue_concrete_powder', 432],
      'light_blue_concrete_powder': ['light_blue_concrete_powder_stairs', 683],
      'yellow_concrete_powder_stairs': ['yellow_concrete_powder', 433],
      'yellow_concrete_powder': ['yellow_concrete_powder_stairs', 684],
      'lime_concrete_powder_stairs': ['lime_concrete_powder', 434],
      'lime_concrete_powder': ['lime_concrete_powder_stairs', 685],
      'pink_concrete_powder_stairs': ['pink_concrete_powder', 435],
      'pink_concrete_powder': ['pink_concrete_powder_stairs', 686],
      'gray_concrete_stairs': ['gray_concrete', 420],
      'gray_concrete': ['gray_concrete_stairs', 687],
      'light_gray_concrete_stairs': ['light_gray_concrete', 421],
      'light_gray_concrete': ['light_gray_concrete_stairs', 688],
      'cyan_concrete_stairs': ['cyan_concrete', 422],
      'cyan_concrete': ['cyan_concrete_stairs', 689],
      'purple_concrete_stairs': ['purple_concrete', 423],
      'purple_concrete': ['purple_concrete_stairs', 690],
      'blue_concrete_stairs': ['blue_concrete', 424],
      'blue_concrete': ['blue_concrete_stairs', 691],
      'brown_concrete_stairs': ['brown_concrete', 425],
      'brown_concrete': ['brown_concrete_stairs', 692],
      'green_concrete_stairs': ['green_concrete', 426],
      'green_concrete': ['green_concrete_stairs', 693],
      'red_concrete_stairs': ['red_concrete', 427],
      'red_concrete': ['red_concrete_stairs', 694],
      'black_concrete_stairs': ['black_concrete', 428],
      'black_concrete': ['black_concrete_stairs', 695]
  }


  player._client.on('block_place', async ({ direction, location, cursorY, hand } = {}) => {
    // at the moment we use the client to vet placing object, we should check here too to prevent hackers

    serv.info("Hand value is " + hand.toString())
    if ( placing === true) { return }
    placing = true
    setTimeout( function() { placing = false}, 200)

    const referencePosition = new Vec3(location.x, location.y, location.z)
    const block = await player.world.getBlock(referencePosition)
    block.position = referencePosition
    if (await serv.interactWithBlock({ block, player })) return
    if (player.gameMode >= 2) return

    const heldItem = player.inventory.slots[QUICK_BAR_START + player.heldItemSlot]
    console.log("Held item name: " + heldItem.name)
    console.log("Held item type: " + heldItem.type)
    console.log("Hand: " + hand)
    if (!heldItem || direction === -1 || heldItem.type === -1) return
    console.log("Block data: ", mcData.blocksByName[heldItem.name])
    if (hand === 2 && specialPlace.hasOwnProperty(heldItem.name)) {
      console.log("Ctrl place action")
      heldItem.type = specialPlace[heldItem.name][1]
      heldItem.name = specialPlace[heldItem.name][0]
      console.log("New name and item: ", heldItem.type, heldItem.name)
    }

    const directionVector = directionToVector[direction]
    const placedPosition = referencePosition.plus(directionVector)
    const dx = player.position.x - (placedPosition.x + 0.5)
    const dz = player.position.z - (placedPosition.z + 0.5)
    const angle = Math.atan2(dx, -dz) * 180 / Math.PI + 180 // Convert to [0,360[

    if (serv.supportFeature('blockPlaceHasIntCursor')) cursorY /= 16

    let half = cursorY > 0.5 ? 'top' : 'bottom'
    if (direction === 0) half = 'top'
    else if (direction === 1) half = 'bottom'

    const { id, data } = await serv.placeItem({
      item: heldItem,
      angle,
      direction,
      player,
      referencePosition,
      placedPosition,
      directionVector,
      properties: {
        rotation: Math.floor(angle / 22.5 + 0.5) & 0xF,
        axis: directionToAxis[direction],
        facing: directionToFacing[Math.floor(angle / 90 + 0.5) & 0x3],
        half,
        waterlogged: (await player.world.getBlock(placedPosition)).type === mcData.blocksByName.water.id
      }
    })

    if (!blocks[id]) return

    const sound = 'dig.' + (materialToSound[blocks[id].material] || 'stone')
    serv.playSound(sound, player.world, placedPosition.offset(0.5, 0.5, 0.5), {
      pitch: 0.8
    })

    if (player.gameMode === 0) {
      heldItem.count--
      if (heldItem.count === 0) {
        player.inventory.updateSlot(QUICK_BAR_START + player.heldItemSlot, null)
      } else {
      player.inventory.updateSlot(QUICK_BAR_START + player.heldItemSlot, heldItem)
      }
    }

    const stateId = serv.supportFeature('theFlattening') ? (blocks[id].minStateId + data) : (id << 4 | data)
    player.setBlock(placedPosition, stateId)
  })
}

const directionToVector = [new Vec3(0, -1, 0), new Vec3(0, 1, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 1), new Vec3(-1, 0, 0), new Vec3(1, 0, 0)]
const directionToAxis = ['y', 'y', 'z', 'z', 'x', 'x']
const directionToFacing = ['north', 'east', 'south', 'west']
