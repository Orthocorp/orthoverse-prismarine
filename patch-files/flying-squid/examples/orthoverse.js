const mcServer = require('flying-squid')

const options = {
  motd: 'The Orthoverse metaverse world',
  port: 20565,
  'max-players': 12,
  'online-mode': false,
  logging: true,
  gameMode: 0,
  difficulty: 1,
  worldFolder: 'world',
  generation: {
    name: 'orthogen',
    options: {
      seed: 100,
      version: '1.15.2'
    }
  },
  kickTimeout: 60000,
  checkTimoutInterval: 4000,
  plugins: {
    hengeportals: 'hengeportals',
    ethereum: 'ethereum'
  },
  modpe: false,
  'view-distance': 6,
  'player-list-text': {
    header: 'Orthoverse',
    footer: 'Voxel World'
  },
  'everybody-op': false,
  'operators': ['BCGandalf', 'TheOtherGuy'],
  'max-entities': 1000,
  version: '1.15.2',
  'landsApi': 'https://orthoverse.io/api/land/generate/voxel',
  'landSaves': './land-saves/region/',
  'debug': {
    // 'landupdate': true, // ****** DEBUG: artificially change level of Fangwanina in landSyncCheck
    'revealtest': true, // ****** DEBUG: check that revealed tokens work
  }
}

function main() {
  const orthoverse = mcServer.createMCServer(options)
  return orthoverse
}

function forceLandRefresh (orthoverse, key) {
  // call orthogen to create the default land, which also saves it to slot 0
  // and records this fact
  const coords = key.split(':')  // coords[0] === landX and coords[1] === landZ
  // this should trigger a regeneration of the land
  orthoverse.overworld.chunkGenerator(orthoverse, coords[0] * 6, coords[1] * 6)
  // finally, load the land
  const triggerLoad = orthoverse
    .voxel
    .loadLand(orthoverse.voxel.data[key][6], coords[0], coords[1])
}

function checkChange (orthoverse, key, value) {
  let result = false
  // cases:
    // land has been revealed for the first time
  if (!(key in orthoverse.voxel.data)) {
    console.log("Adding land " + value[1])
    orthoverse.voxel.data[key] = {...value}
    forceLandRefresh(orthoverse, key)
    result = true
  } else {
    // land has flipped or land has leveled up (these are handled the same way)
    if (orthoverse.voxel.data[key][2] !== value[2]) {
      console.log("Land level changed")
      // update doxels.json to reflect the level or flip change
      orthoverse.voxel.data[key][2] = value[2]
      // remove the save slot from doxels.json if it exists
      if (orthoverse.voxel.data[key].length === 7) {
        orthoverse.voxel.data[key].pop()
      }
      forceLandRefresh(orthoverse, key)
      result = true
    }
    // land has changed owners    
    if (orthoverse.voxel.data[key][4].toString() !== value[4].toString()) {
      console.log(orthoverse.voxel.data[key][4], value[4])
      orthoverse.voxel.data[key][4] = value[4]
      console.log("Owner or delegates changed")
      // placeholder for any other stuff that needs to be done, e.g.
      // check that someone can no longer build, but I'm not sure
      // anything like that is actually needed.
      result = true
    }
    // land has changed position
    if (orthoverse.voxel.data[key][0] != value[0]) {
      console.log("Position of land changed for " + value[1])
      // placeholder for second wave of lockdowns
      result = true
    }
  }
  return result
}


main().then( (orthoverse) => {
  // this is a bit clunky - we load the doxel.json prototype from the database
  // with orthverse.voxel.load()
  // and then use orthoverse.voxel.loadFile() which replaces the object in memory
  // with the contents of a previously saved file if it exists
  // if the file doesn't exist we save the database generated doxel.json
  // *** this is confusing and should be replaced with a "check if doxel.json exists, and
  // if not, use the database to create one
  orthoverse.voxel.load().then( () => {
    orthoverse.voxel.loadFile()
    orthoverse.connect(options)
    // ****** DEBUG: check that revealed tokens work
      if (orthoverse.options.debug.revealtest === true) {
        // only have the orthohenge loaded
        orthoverse.voxel.data = {
          "0:0": [
          "0xdecaf9eb81d2e2289aad58f4df641a5a44bd84ff",
          "Orthohenge",
          7,
          "933.png",
          [
            "0xdecaf9eb81d2e2289aad58f4df641a5a44bd84ff"
          ],
          "2023-02-01T21:45:41.375Z",
        ],
        "timestamp": 100
        }
      }
    // ******

    // check on land sync state every 10 minutes and save the land status
    let unhandled = {}
    const landSyncCheck = setInterval(function() {
      if (Object.keys(unhandled).length) {
        console.log("Processing unhandled land updates")
        // forcing a synchronous loop
        const keys = Object.keys(unhandled)
        let change = false
        for (let i = 0; i < Math.min(keys.length, 16); i++) {
          const key = keys[i]
          const value = unhandled[key]
          if (checkChange(orthoverse, key, value) === true) {change = true}
          delete unhandled[keys[i]]
        }
        if (change) orthoverse.voxel.saveFile()
      } else {
        orthoverse.voxel.loadDiff().then( (result) => {
          unhandled = JSON.parse(JSON.stringify(result.data))
          // ****** DEBUG: artificially change level of Fangwanina in landSyncCheck
            if (orthoverse.options.debug.landupdate === true) {
              console.log("Faking Fangwanina level change")
              Object.assign(result.data, {["0:-1"]: [...orthoverse.voxel.data["0:-1"]]})
              result.data["0:-1"][2] = (result.data["0:-1"][2] + 1) % 16
            }
          // ******
          console.log("Checking for new land updates")
          // forcing a synchronous loop
          const keys = Object.keys(unhandled)
          let change = false
          for (let i = 0; i < Math.min(keys.length, 16); i++) {
            const key = keys[i]
            const value = unhandled[key]
            if (checkChange(orthoverse, key, value) === true) {change = true}
            delete unhandled[keys[i]]
          }
          if (change) orthoverse.voxel.saveFile()
        })
      }
    }, 1000*60*1) 
  })
})

// console.log(orthoverse.motd)
