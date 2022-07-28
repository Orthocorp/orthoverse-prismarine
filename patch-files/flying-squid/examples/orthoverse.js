const mcServer = require('flying-squid')
const Vec3 = require('vec3').Vec3;

const orthoverse = mcServer.createMCServer({
  motd: 'The Orthoverse \nProvided by Flying Squid',
  port: 20565,
  'max-players': 10,
  'online-mode': false,
  logging: true,
  gameMode: 2,
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

