# Orthogen

An Orthoverse minecraft generation function

## Usage

```js
const World = require('prismarine-world')('1.12')
const Vec3 = require('vec3').Vec3

const flatLand = require('flatland')({version: '1.16.1', seed: Math.floor(Math.random() * Math.pow(2, 31))})
const world = new World(flatLand)

world.getBlock(new Vec3(3, 50, 3)).then(block => console.log(JSON.stringify(block, null, 2)))
```

## Contributors

* @kf106

### 0.0.0

* first version, imported from flying-squid, works
