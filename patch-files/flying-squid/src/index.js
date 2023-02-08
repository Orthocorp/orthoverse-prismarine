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
const fse = require('fs-extra')
const fs = require('fs')
const Chunk = require('prismarine-chunk')('1.15.2')

const supportFeature = require('./lib/supportFeature')


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
  const mcServer = new MCServer(options.landsApi, options.landSaves)
  return mcServer
}

class MCServer extends EventEmitter {
  constructor (landsApi, landSaves) {
    super()
    this._server = null

    // This section initialises the voxel object for the world
    this.voxel = {}
    this.voxel.data = {}
    this.voxel.status = {}
    this.voxel.landSaves = landSaves

    // load current data structure for world from API database
    this.voxel.load = async () => {
      return axios.get(landsApi)
        .then(response => {
          this.voxel.data = response.data
          this.voxel.data['timestamp'] = Date.now()
          console.log('Loaded world from database')
        })
        .catch(err => {
          throw(err)
        })
    }

    // loads everything that has changed since the current stored timestamp
    this.voxel.loadDiff = async () => {
       return axios.get(landsApi + '?updated_at=' + new Date(this.voxel.timestamp).toISOString())
        .then(response => {
          const diff = response.data
          console.log('Loaded diff from database')
        })
        .catch(err => {
          throw(err)
        })
    }

    // we use the file system to store the current state regularly
    this.voxel.loadFile = () => {
      if(!fs.existsSync('./map-data/doxel.json')) {
        this.voxel.saveFile()
      } else {
        this.voxel.data = JSON.parse(fs.readFileSync('./map-data/doxel.json'))
      }
    }

    // helper function to save the current state of the voxel world
    this.voxel.saveFile = () => {
      this.voxel.data['timestamp'] = Date.now()
      fs.writeFileSync('./map-data/doxel.json', JSON.stringify(this.voxel.data), (err) => {
        if (err) throw err
      })
    }

    // the status object keeps track of which land uses what save file (if any)
    this.voxel.loadStatus = () => {
      if(fs.existsSync('./map-data/status.json')) {
        this.voxel.status = JSON.parse(fs.readFileSync('./map-data/status.json'))
      } else {
        this.voxel.status['timestamp'] = Date.now()
        fs.writeFileSync('./map-data/status.json', JSON.stringify(this.voxel.status), (err) => {
          if (err) throw err
        })
      }
    }

    // need to be able to save status to file in case the server is restarted
    this.voxel.saveStatus = () => {
      this.voxel.status['timestamp'] = Date.now()
      fs.writeFileSync('./map-data/status.json', JSON.stringify(this.voxel.status), (err) => {
        if (err) throw err
      })
    }

    // function to load a 6x6 land from a save file
    this.voxel.loadLand = (slot, lat, long) => {
      const landPos = long.toString() + ':' + lat.toString()
      // check there is actually a land to load

      // now we are ready to load that land from a file
      const loadPath = this.voxel.landSaves
                       + this.voxel.data[landPos][0] + '/'
                       + ((parseInt(this.voxel.data[landPos][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      // check if land save folder exists and exit if it doesn't
      let bitmapObj
      try {
        bitmapRaw = fs.readFileSync(loadPath + "bitmap-" + slot.toString() + ".json", 'utf-8')
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
         return 'mesg:You cannot load an unsaved land.'
      }
      for (let chunkZ = lat * 6; chunkZ < (lat * 6) + 6; chunkZ++) { 
        for (let chunkX = long * 6; chunkX < (long * 6) + 6; chunkX++) { 
          const loadFileName =  'land.' + 
                                chunkX.toString() + '.' + 
                                chunkZ.toString() + '.' + 
                                slot.toString()
          try {
            const chunkData = new Buffer.from(fs.readFileSync(loadPath + loadFileName + '.lnd'));
            const chunk = new Chunk()
            chunk.load(chunkData, bitmap=bitmapObj[chunkX + ':' + chunkZ])
            // set the new chunk
            this.overworld.sync.setColumn(chunkX, chunkZ, chunk)
            // send the chunk to relevant players
            this.reloadChunks(this.overworld, [{chunkX, chunkZ}])
          } catch (e) {
            return 'mesg:Error loading: ' + e
          }
        }
      }
      return 'mesg:Loaded new state for ' + this.voxel.data[landPos][1] + ' in slot ' + slot.toString()
    }

    // function to save a 6x6 land to a save file
    this.voxel.saveLand = (slot, lat, long) => {
      const landPos = long.toString() + ':' + lat.toString()
      // now we are ready to save that land into a file
      // file name format: <slot>-<realm>.lnd
      // Note that the region files containing the land data are in
      // *.mca files in flying-squid/world/region/
      // we save individual player builds in flying-squid/world/region/builds/<land-address>/
      const savePath = this.voxel.landSaves
                       + this.voxel.data[landPos][0] + '/'
                       + ((parseInt(this.voxel.data[landPos][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      console.log("savePath is " + savePath)
      // check if land save folder exists and make it if it doesn't
      fse.ensureDirSync(savePath)

      // mca stands for minecraft anvil region
      // a chunk is a 16x256x16 column of data. An Orthoverse land is a 96 block wide square, 
      // making it a 6 by 6 collection of chunks
      // so to save a land we just need to save an array of 6x6 = 36 chunks

      let bitmapObj = {}

      for (let chunkZ = lat * 6; chunkZ < (lat * 6) + 6; chunkZ++) { 
        for (let chunkX = long * 6; chunkX < (long * 6) + 6; chunkX++) { 
          const saveFileName = 'land.' + chunkX.toString() + '.' + chunkZ.toString() + '.' + slot.toString() 

          let chunkDump
          console.log("Trying to save chunk " + chunkX.toString() + ":" + chunkZ.toString())
          try {
            const chunk = this.overworld.sync.getColumn(chunkX, chunkZ)
            chunkDump = chunk.dump()
            bitmapObj[chunkX.toString() + ':' + chunkZ.toString()] = chunk.dumpMask()
          } catch (e) {
            player._client.writeChannel('ethereum', 'mesg:Error chunk: ' + e)
          }

          try {
            fs.writeFileSync(savePath + saveFileName + ".lnd", chunkDump)
          } catch (e) {
            player._client.writeChannel('ethereum', 'mesg:Error saving: ' + e)
          }
        }
      }
      fs.writeFileSync(savePath + 
                       "bitmap-" + 
                       slot.toString() + 
                       ".json", JSON.stringify(bitmapObj), 'utf-8')
      return 'mesg:Saved new state for ' + this.voxel.data[landPos][1] + ' in slot ' + slot.toString()
    }


  }


  connect (options) {
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
