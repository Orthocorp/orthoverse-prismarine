const mcServer = require('flying-squid')

const orthoverse = mcServer.createMCServer({
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
  'lands-api': 'https://orthoverse.io/api/land/search/byCoordinates'
})

// console.log(orthoverse.motd)
