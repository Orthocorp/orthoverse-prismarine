if (typeof process !== 'undefined' && parseInt(process.versions.node.split('.')[0]) < 14) {
  console.error('[\x1b[31mCRITICAL\x1b[0m] Node.JS 14 or newer is required')
  console.error('[\x1b[31mCRITICAL\x1b[0m] You can download the new version from https://nodejs.org/')
  console.error(`[\x1b[31mCRITICAL\x1b[0m] Your current Node.JS version is: ${process.versions.node}`)
  process.exit(1)
}

const mc = require('minecraft-protocol')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const requireIndex = require('./lib/requireindex')
const supportedVersions = require('./lib/version').supportedVersions
const Command = require('./lib/command')
require('emit-then').register()
if (process.env.NODE_ENV === 'dev') {
  require('longjohn')
}
const axios = require('axios')

const supportFeature = require('./lib/supportFeature')
const fs = require('fs')

module.exports = {
  createMCServer,
  Behavior: require('./lib/behavior'),
  Command: require('./lib/command'),
  generations: require('./lib/generations'),
  experience: require('./lib/experience'),
  UserError: require('./lib/user_error'),
  portal_detector: require('./lib/portal_detector'),
  supportedVersions
}

async function createMCServer (options) {
  options = options || {}
  const mcServer = new MCServer(options.landsApi)
  return mcServer
}

class MCServer extends EventEmitter {
  constructor (landsApi) {
    super()
    this._server = null

    // This section initialises the voxel object for the world
    this.voxel = {}
    this.voxel.data = {}
    this.voxel.timestamp = Date.now()

    // the initial voxel data structure loading
    this.voxel.load = async () => {
      axios.get(landsApi)
        .then(response => {
          this.voxel.data = response.data
          this.voxel.timestamp = Date.now()
          console.log('Loaded world from database')
        })
        .catch(err => {
          throw(err)
        })
    }

    // loads everything that has changed since the last upload
    this.voxel.loadDiff = async () => {
      // TODO; need to add the API string here
      axios.get('' + new Date(this.voxel.timestamp).toISOString())
        .then(response => {
          const diff = response.data
          this.voxel.timestamp = Date.now()
          console.log('Loaded diff from database')
        })
        .catch(err => {
          throw(err)
        })
    }

    // for backup purposes we can have a load and save file option
    this.voxel.loadFile = () => {
      if(!fs.existsSync('./map-data/voxel.json')) {
        throw('Could not read voxel.json')
      } else {
        this.voxel.data = JSON.parse(fs.readFileSync('./map-data/voxel.json'))
      }
    }

    this.voxel.saveFile = () => {
      this.voxel.data['tamestamp'] = Date.now()
      fs.writeFileSync('./map-data/voxel.json', JSON.stringify(this.voxel.data), (err) => {
        if (err) throw err
      })
    }
  }


  connect (options) {
    console.log('Is land loaded')
    console.log(this.voxel.data)
    const version = require('minecraft-data')(options.version).version
    if (!supportedVersions.some(v => v.includes(version.majorVersion))) {
      throw new Error(`Version ${version.minecraftVersion} is not supported.`)
    }
    this.supportFeature = feature => supportFeature(feature, version.majorVersion)

    const plugins = requireIndex(path.join(__dirname, 'lib', 'plugins'))
    this.commands = new Command({})
    this._server = mc.createServer(options)
    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].server !== undefined)
      .forEach(pluginName => plugins[pluginName].server(this, options))
    if (options.logging === true) this.createLog()
    this._server.on('error', error => this.emit('error', error))
    this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port))
    this.emit('asap')
  }
}
