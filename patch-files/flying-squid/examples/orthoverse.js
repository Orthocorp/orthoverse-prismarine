const mcServer = require('flying-squid')

const orthoverse = mcServer.createMCServer({
  motd: 'The Orthoverse \nMany thanks to PrismarineJS!',
  port: 20565,
  'max-players': 10,
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
  kickTimeout: 10000,
  plugins: {
    hengeportals: 'hengeportals',
    ethereum: 'ethereum'
  },
  modpe: false,
  'view-distance': 10,
  'player-list-text': {
    header: 'Orthoverse',
    footer: 'Voxel World'
  },
  'everybody-op': false,
  'max-entities': 100,
  version: '1.15.2'
})

console.log(orthoverse.motd)
