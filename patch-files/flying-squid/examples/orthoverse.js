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
    'landupdate': true, // ****** DEDUG: artificially change level of Fangwanina in landSyncCheck
  }
}

function main() {
  const orthoverse = mcServer.createMCServer(options)
  return orthoverse
}

function checkChange (orthoverse, key, value) {
  // cases:
  // land has been revealed for the first time
  if (!(key in orthoverse.voxel.data)) {
    console.log("Key not in voxel.data")
    orthoverse.voxel.data[key] = value
    // save the land into the .mca file and the save file
         
    // finally, load the land because someone might be swimming in the sea that it was before
    const coords = key.split(':')
    const triggerLoad = orthoverse.voxel.loadLand(orthoverse.voxel.data[key][2], coords[0], coords[1])
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
      // now call orthogen to create the default land, which also saves it to slot 0
      // and records this fact
      const coords = key.split(':')  // coords[0] === landX and coords[1] === landZ
      // this should trigger a regeneration of the land
      orthoverse.overworld.chunkGenerator(orthoverse, coords[0] * 6, coords[1] * 6)
      // finally, load the land
      const triggerLoad = orthoverse
        .voxel
        .loadLand(orthoverse.voxel.data[key][6], coords[0], coords[1])
    }
    // land has changed owners    
    if (orthoverse.voxel.data[key][4].toString() !== value[4].toString()) {
      console.log(orthoverse.voxel.data[key][4], value[4])
      orthoverse.voxel.data[key][4] = value[4]
      console.log("Owner or delegates changed")
      // placeholder for any other stuff that needs to be done, e.g.
      // check that someone can no longer build, but I'm not sure
      // anything like that is actually needed.
    }
    // land has changed position
    if (orthoverse.voxel.data[key][0] != value[0]) {
      console.log("Position of land changed for " + value[1])
      // placeholder for second wave of lockdowns
    }
  }
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

    // check on land sync state every 10 minutes and save the land status
    const landSyncCheck = setInterval(function() {
      orthoverse.voxel.loadDiff().then( (result) => {
        // ****** DEDUG: artificially change level of Fangwanina in landSyncCheck
          if (orthoverse.options.debug.landupdate === true) {
            console.log("Faking Fangwanina level change")
            Object.assign(result.data, {["0:-1"]: [...orthoverse.voxel.data["0:-1"]]})
            console.log(result.data["0:-1"][2])
            result.data["0:-1"][2] = (result.data["0:-1"][2] + 1) % 16
            console.log((result.data["0:-1"][2] + 1) % 16)
            console.log(result.data["0:-1"][2])
            console.log(orthoverse.voxel.data["0:-1"][2])
          }
        // ******
        console.log("Checking changes")
        for (const [key, value] of Object.entries(result.data)) {
          if (value[1] === "Fangwanina") {
            console.log("Fangwanina change found")
            console.log(value)
            console.log(orthoverse.voxel.data[key])
          }
          
          checkChange(orthoverse, key, value)
        }
        orthoverse.voxel.saveFile()
      })
    }, 1000*60*0.5) 
  })
})

// console.log(orthoverse.motd)
