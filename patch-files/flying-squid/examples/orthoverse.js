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
  'landSaves': './land-saves/region/'
}

function main() {
  const orthoverse = mcServer.createMCServer(options)
  return orthoverse
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
    // correct string of owner to array of owner and delegated builders *** remove after API change
    Object.keys(orthoverse.voxel.data).forEach( (entry) => {
      if (typeof orthoverse.voxel.data[entry][4] === "string") {
        orthoverse.voxel.data[entry][4] = [orthoverse.voxel.data[entry][4]]
      }
    })
    orthoverse.connect(options)

    // check on land sync state every 10 minutes and save the land status
    const landSyncCheck = setInterval(function() {
      // check database diff
      orthoverse.voxel.loadDiff().then( (result) => {
        console.log("Changes: ", result.data)
        console.log("End of changes")
        Object.keys(result.data).forEach((change) => {
          // correct string of owner to array of owner and delegated builders *** remove after API change
          if (typeof result.data[change][4] === "string") {
            result.data[entry][4] = [result.data[entry][4]]
          }
          // cases:
          // land has been revealed for the first time
          if (!(change in orthoverse.voxel.data)) {
            orthoverse.voxel.data[change] = result.data[change]
            // save the land into the .mca file and the save file
            
            // finally, load the land because someone might be swimming in the sea that it was before
            const coords = change.split(':')
            const result = serv.voxel.loadLand(orthoverse.voxel.data[change][2], coords[0], coords[1])
          } else {
            // land has flipped or land has leveled up (these are handled the same way)
            if (orthoverse.voxel.data[change][2] != result.data[change][2]) {
              // update doxels.json to reflect the level or flip change
              orthoverse.voxel.data[change][2] = result.data[change][2]
              // remove the save slot from doxels.json if it exists
              if (orthoverse.voxel.data[change].length === 7) {
                orthoverse.voxel.data[change].pop()
              }
              // now call orthogen to create the default land, which also saves it to slot 0
              // and records this fact
              const coords = change.split(':')  // coords[0] === landX and coords[1] === landZ
              generateSimpleChunk(orthoverse, coords[0] * 6, coords[1] * 6)
              // finally, load the land
              
              const result = serv.voxel.loadLand(orthoverse.voxel.data[change][6], coords[0], coords[1])
            }
            // land has changed owners    
            if (orthoverse.voxel.data[change][4][0] != result.data[change][4][0]) {
              orthoverse.voxel.data[change][4] = result.data[change][4]
              // placeholder for any other stuff that needs to be done, e.g.
              // check that someone can no longer build, but I'm not sure
              // anything like that is actually needed.
            }
            // land has changed position
            if (orthoverse.voxel.data[change][0] != result.data[change][0]) {
              // placeholder for second wave of lockdowns
            }
          }
        })
        orthoverse.voxel.saveFile()
      })
      // save current status
    }, 1000*20) 

  })
})

// console.log(orthoverse.motd)
