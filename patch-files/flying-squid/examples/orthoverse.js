const mcServer = require('flying-squid')

mcServer.createMCServer({
  motd: 'A Minecraft Server \nRunning flying-squid',
  port: 20565,
  'max-players': 10,
  'online-mode': false,
  logging: true,
  gameMode: 1,
  difficulty: 1,
  worldFolder: 'world',
  generation: {
    name: 'orthogen',
    options: {
      seed: 100,
      version: '1.16.1'
    }
  },
  kickTimeout: 10000,
  plugins: {

  },
  modpe: false,
  'view-distance': 10,
  'player-list-text': {
    header: 'Orthoverse',
    footer: 'Voxel World'
  },
  'everybody-op': true,
  'max-entities': 100,
  version: '1.16.1'
})
