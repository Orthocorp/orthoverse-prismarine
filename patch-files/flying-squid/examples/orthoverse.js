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
      version: '1.15.2',
      pregen: 6*2
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
  'landsApi': 'https://orthoverse.io/api/land/generate/voxel'
}

function main() {
  const orthoverse = mcServer.createMCServer(options)
  return orthoverse
}


main().then( (orthoverse) => {
  orthoverse.voxel.load()
  setTimeout(function() { orthoverse.connect(options)}, 5000)
})

// console.log(orthoverse.motd)
