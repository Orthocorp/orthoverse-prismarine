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
const Chunk = require('prismarine-chunk')('1.15')

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
  const mcServer = new MCServer(options)
  return mcServer
}

class MCServer extends EventEmitter {
  constructor (options) {
    super()
    this._server = null
    this.options = options

    // This section initialises the voxel object for the world
    this.voxel = {}
    this.voxel.data = {}
    this.voxel.status = {}
    this.voxel.landSaves = options.landSaves

    //  function to load current data structure for world from API database
    this.voxel.load = async () => {
      return axios.get(options.landsApi)
        .then(response => {
          this.voxel.data = response.data
          this.voxel.data['timestamp'] = Date.now()
          console.log('Loaded world from database')
        })
        .catch(err => {
          console.error("Voxel load error: ", err)
        })
    }

    // function to load everything that has changed since the current stored timestamp
    this.voxel.loadDiff = async () => {
      return axios.get(options.landsApi + '?updated_at=' 
        + (new Date(this.voxel.data.timestamp).toISOString()))
    }

    // we use the file system to store the current state regularly
    // doxel.js is a dump of the current database state
    // function to load doxel.json
    this.voxel.loadFile = () => {
      if(!fs.existsSync(this.voxel.landSaves + '../doxel.json')) {
        console.log("doxel doesn't exist so I'm saving it")
        this.voxel.saveFile()
      } else {
        this.voxel.data = JSON.parse(fs.readFileSync(this.voxel.landSaves + '../doxel.json'))
      }
    }

    // function to save the current state of the voxel world
    this.voxel.saveFile = () => {
      this.voxel.data['timestamp'] = Date.now()
      fs.writeFileSync(this.voxel.landSaves + '../doxel.json', JSON.stringify(this.voxel.data), (err) => {
        if (err) {
          console.error("Voxel save file error: ", err)
        }
      })
    }

    // function to load a 6x6 land from a save file to the .mca file
    this.voxel.loadLand = (slot, landX, landZ) => {
      const landKey = landX.toString() + ':' + landZ.toString()
      // now we are ready to load that land from a file
      const loadPath = this.voxel.landSaves
                       + this.voxel.data[landKey][1] + '/'
                       + ((parseInt(this.voxel.data[landKey][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      let bitmapObj, bitmapRaw
      if (!(fs.existsSync(loadPath + "bitmap-" + slot.toString() + ".json"))) {
         return 'mesg:You cannot load an unsaved land.'
      }
      try {
        bitmapRaw = fs.readFileSync(loadPath + "bitmap-" + slot.toString() + ".json", 'utf-8')
      } catch (e) {
         return 'mesg:You cannot load an unsaved land.'
      }
      try {
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
        return 'mesg:Error parsing bitmap file'
      }
      for (let chunkZ = landZ * 6; chunkZ < (landZ * 6) + 6; chunkZ++) { 
        for (let chunkX = landX * 6; chunkX < (landX * 6) + 6; chunkX++) { 
          const loadFileName =  'land.' + 
                                chunkX.toString() + '.' + 
                                chunkZ.toString() + '.' + 
                                slot.toString()
          try {
            const chunkData = new Buffer.from(fs.readFileSync(loadPath + loadFileName + '.lnd'));
            const chunk = new Chunk()
            chunk.load(chunkData, bitmapObj[chunkX.toString() + ':' + chunkZ.toString()])
            // set the new chunk
            this.overworld.sync.setColumn(chunkX, chunkZ, chunk)
            // send the chunk to relevant players
            this.reloadChunks(this.overworld, [{chunkX, chunkZ}])
          } catch (e) {
            return 'mesg:Error loading: ' + e
          }
        }
      }
      return 'mesg:Loaded new state for ' + this.voxel.data[landKey][1] + ' in slot ' + slot.toString()
    }

    // function to save a 6x6 land to a save file from the mca file
    // takes a land position
    this.voxel.saveLand = (slot, landX, landZ) => {
      const landKey = landX.toString() + ':' + landZ.toString()
      const savePath = this.voxel.landSaves
                       + this.voxel.data[landKey][1] + '/'
                       + ((parseInt(this.voxel.data[landKey][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      fse.ensureDirSync(savePath)
      let bitmapObj, bitmapRaw
      try {
        bitmapRaw = fs.readFileSync(savePath + "bitmap-" + slot.toString() + ".json", 'utf-8')
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
        bitmapObj = {}
      }
      for (let chunkZ = landZ * 6; chunkZ < (landZ * 6) + 6; chunkZ++) { 
        for (let chunkX = landX * 6; chunkX < (landX * 6) + 6; chunkX++) { 
          const saveFileName = 'land.' + chunkX.toString() + '.' + chunkZ.toString() + '.' + slot.toString() 

          let chunkDump
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
      // need to store the fact that this is the slot that is being used
      this.voxel.data[landKey][6] = slot
      return "mesg:Saved land to slot " + slot.toString()
    }

    // saves a single chunk to the relevant land-saves folder
    this.voxel.saveChunkToFile = (slot, chunkX, chunkZ, chunk) => {
      const landX = Math.floor(chunkX / 6)
      const landZ = Math.floor(chunkZ / 6)
      const landKey = landX.toString() + ':' + landZ.toString()
      const savePath = this.voxel.landSaves
                       + this.voxel.data[landKey][1] + '/'
                       + ((parseInt(this.voxel.data[landKey][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      fse.ensureDirSync(savePath)
      // load bitmap if it already exists
      let bitmapObj, bitmapRaw
      try {
        bitmapRaw = fs.readFileSync(savePath + "bitmap-" + slot.toString() + ".json", 'utf-8')
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
        bitmapObj = {}
      }
      const saveFileName = 'land.' + chunkX.toString() + '.' + chunkZ.toString() + '.' + slot.toString() 
      let chunkDump
      try {
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
      fs.writeFileSync(savePath + 
                       "bitmap-" + 
                       slot.toString() + 
                       ".json", JSON.stringify(bitmapObj), 'utf-8')
    }

    // reads a single chunk from a land-saves folder and returns it
    this.voxel.loadChunkFromFile = (slot, chunkX, chunkZ) => { 
      const landX = Math.floor(chunkX / 6)
      const landZ = Math.floor(chunkZ / 6)
      const landKey = landX.toString() + ':' + landZ.toString()
      const loadPath = this.voxel.landSaves
                       + this.voxel.data[landKey][1] + '/'
                       + ((parseInt(this.voxel.data[landKey][2]) > 7) ? 'futuristic' : 'fantasy')
                       + '/'
      let bitmapObj, bitmapRaw
      try {
        bitmapRaw = fs.readFileSync(loadPath + "bitmap-" + slot.toString() + ".json", 'utf-8')
        bitmapObj = JSON.parse(bitmapRaw)
      } catch (e) {
        bitmapObj = {}
      }
      let chunk = new Chunk()
      const loadFileName =  'land.' + 
                            chunkX.toString() + '.' + 
                            chunkZ.toString() + '.' + 
                            slot.toString()
      try {
        const chunkData = new Buffer.from(fs.readFileSync(loadPath + loadFileName + '.lnd'));
        chunk.load(chunkData, bitmapObj[chunkX.toString() + ':' + chunkZ.toString()])
      } catch (err) {
        console.error("Load chunk from file error: ", err)
      }
      return chunk
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
