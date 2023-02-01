// Queries the database and builds an oxel.json file, which is like voxel.json but
// using objects rather than arrays

const fs = require('fs')
const axios = require('axios')

let oxel = {}

oxel.timestamp = Date.now()

const getData = async () => {
  for (let x = -50; x <= 50; x++) {
    for (let y = -50; y <= 50; y++) {
      try {
        const query = 'https://orthoverse.io/api/land/search/byCoordinates?x=' + x.toString() + '&y=' + y.toString()
        console.log(query)
        const response = await axios.get(query)
        console.log(response.data)
        oxel[x.toString() + ":" + y.toString()] = response.data
      } catch (error) {}
    }
  }
}

getData().then( result => {
  console.log("This is oxel")
  console.log(oxel)
  fs.writeFileSync('./map-data/oxel.json', JSON.stringify(oxel))
})

