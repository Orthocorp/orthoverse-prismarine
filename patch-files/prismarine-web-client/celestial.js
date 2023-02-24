global.THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

export function celestial (viewer, bot) {
  // Day and night
  const skyColor = viewer.scene.background.getHexString()

  // skybox
  const skyGeo = new THREE.BoxGeometry(520, 520, 520)
  const feature = 'sh'

  const loader = new THREE.TextureLoader()
  const skyMaterials = [
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_ft.png'),
      transparent: true,
      side: THREE.DoubleSide
    }), // WS
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_bk.png'),
      transparent: true,
      side: THREE.DoubleSide
    }), // ES
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_up.png'),
      transparent: true,
      side: THREE.DoubleSide
    }), // Up
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_dn.png'),
      transparent: true,
      side: THREE.DoubleSide
    }), // Down
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_rt.png'),
      transparent: true,
      side: THREE.DoubleSide
    }), // NS
    new THREE.MeshBasicMaterial({
      map: loader.load('extra-textures/background/' + feature + '_lf.png'),
      transparent: true,
      side: THREE.DoubleSide
    }) // SS
  ]

  const skybox = new THREE.Mesh(skyGeo, skyMaterials)

  // add the sun and moon
  const sunGeo = new THREE.SphereGeometry(46, 24, 24)
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  const sun = new THREE.Mesh(sunGeo, sunMaterial)

  const moonColor = '#aaaaaa'
  const moonMaterial = new THREE.MeshBasicMaterial({ color: moonColor })
  const moonGeo = new THREE.SphereGeometry(42, 32, 32)
  const moon = new THREE.Mesh(moonGeo, moonMaterial)

  const phaseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const phaseGeo = new THREE.SphereGeometry(43, 32, 32, Math.PI, Math.PI, 0, Math.PI)
  const phase = new THREE.Mesh(phaseGeo, phaseMaterial)

  const sunDist = 750
  const moonDist = 720
  // orbit raise factor
  const sunH = Math.cos(4000 * Math.PI / 24000) * sunDist
  const moonH = Math.cos(4000 * Math.PI / 24000) * moonDist

  function sunPositionCalculation (age) {
    const time = age % 24000
    if (typeof bot.entity.position.x === 'undefined') {
      return { pos: { x: 0, y: -1 * sunDist, z: 0 }, color: 0 }
    }
    const theta =
      Math.PI / 8 +
      (
        ((
          Math.floor(bot.time.day / 180) / 2 === Math.floor(Math.floor(bot.time.day / 180) / 2)
            ? bot.time.day % 180 + 1
            : 180 - (bot.time.day % 180)
        ) / 180) *
        3 * Math.PI / 8
      )
    // const theta = Math.PI/2
    const rads = ((time / 24000) * 2 * Math.PI) - (Math.PI / 2)
    const sunX =
      bot.entity.position.x +
      Math.cos(rads) * sunDist
    const sunY =
      (Math.sin(rads) * Math.sin(theta) * sunDist) +
      sunH
      // + bot.entity.position.y
    const sunZ = bot.entity.position.z + (Math.cos(theta) * sunDist)
    const colorFactor = Math.abs(Math.sin(rads))
    const red = 0xff
    const green = Math.floor(0xff * (colorFactor))
    const blue = Math.floor(0xff * (colorFactor / 2))
    const color = (red * 0x10000) + (green * 0x100) + blue
    return {
      pos: { x: sunX, y: sunY, z: sunZ },
      color
    }
  }

  function moonPositionCalculation (age) {
    const time = age % 20000
    if (typeof bot.entity.position.x === 'undefined') {
      return { pos: { x: 0, y: -1 * moonDist, z: 0 } }
    }
    const theta =
      Math.PI / 4 +
      (
        ((
          Math.floor(bot.time.day / 14) / 2 === Math.floor(Math.floor(bot.time.day / 14) / 2)
            ? bot.time.day % 14 + 1
            : 14 - (bot.time.day % 14)
        ) / 14) *
        Math.PI / 2
      )
    // const theta = Math.PI/2
    const rads = ((time / 20000) * 2 * Math.PI) - (Math.PI / 2)
    const moonX =
      bot.entity.position.x +
      Math.cos(rads) * moonDist
    const moonY =
      (Math.sin(rads) * Math.sin(theta) * moonDist) +
      moonH
      // + bot.entity.position.y
    const moonZ = bot.entity.position.z + (Math.cos(theta) * moonDist)
    return {
      pos: { x: moonX, y: moonY, z: moonZ }
    }
  }

  sun.position.y = -1 * sunDist
  moon.position.y = -1 * moonDist
  phase.position.y = -1 * moonDist

  viewer.scene.add(sun)
  viewer.scene.add(moon)
  viewer.scene.add(phase)
  viewer.scene.add(skybox)

  // rotate the clouds
  new TWEEN.Tween(skybox.rotation)
    .to({ y: '-' + (Math.PI / 2) * 8 }, 2000000)
    .repeat(Infinity)
    .start()

  // Darken by factor (0 to black, 0.5 half as bright, 1 unchanged)
  function darkenSky (color, factor) {
    color = parseInt(color, 16)
    return '#' + (
      Math.round((color & 0x0000ff) * factor) |
      (Math.round(((color >> 8) & 0x00ff) * factor) << 8) |
      (Math.round((color >> 16) * factor) << 16)
    ).toString(16).padStart(6, 0)
  }

  const maxIntensity = 1
  const depthIntensity = 0.2

  // Provides gradual sunrise or sunset sky
  function intensityCalc (time) {
    const rads = (time / 24000) * 2 * Math.PI - Math.PI / 2
    const sunY = (Math.sin(rads) * sunDist) + sunH
    const factor = sunY / sunDist
    if (factor < -1 * depthIntensity) {
      return 0
    } else if (factor > depthIntensity) {
      return maxIntensity
    } else {
      return (factor + depthIntensity) / (depthIntensity * 2)
    }
  }

  function blendColors (colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16))
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16))
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0')
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0')
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0')
    return '#' + r + g + b
  }

  // Every 750ms change light settings
  const tweenFuture = 750
  let sunP = sunPositionCalculation(bot.time.time)
  let moonP = moonPositionCalculation(bot.time.time)

  window.setInterval(function () {
    if (typeof bot.time.time !== 'undefined') {
      // how bright should the sky be
      let intensity = intensityCalc(bot.time.timeOfDay)

      // calculate eclipse conditions
      const playerPos3 = new THREE.Vector3(
        bot.entity.position.x,
        bot.entity.position.y,
        bot.entity.position.z
      )
      const sunDir = (new THREE.Vector3().subVectors(playerPos3, sun.position)).normalize()
      const moonDir = (new THREE.Vector3().subVectors(playerPos3, moon.position)).normalize()
      const angle = moonDir.angleTo(sunDir)

      // eclipse affects daylight if angle between sun and moon is < 0.02
      if (angle < 0.02) {
        intensity = intensity * Math.abs((angle * 50)) * Math.abs((angle * 50))
      }

      const adjustedSkyColor = new THREE.Color(
        darkenSky(skyColor, intensity)
      )

      viewer.scene.background = adjustedSkyColor
      viewer.ambientLight.intensity =
        (intensity < 0.25 ? 0.25 : intensity)
      viewer.directionalLight.intensity = intensity

      const lightDir = (new THREE.Vector3().subVectors(sun.position, playerPos3)).normalize()
      viewer.directionalLight.position
        .set(lightDir.x, lightDir.y, lightDir.z)

      sunP = sunPositionCalculation(bot.time.time)
      moonP = moonPositionCalculation(bot.time.time)

      if (intensity != 0) {
        sun.material.color.setHex(sunP.color)
        viewer.directionalLight.color.setHex(sunP.color)
      } else {
        sun.material.color.setHex(adjustedSkyColor)
        viewer.directionalLight.color.setHex(adjustedSkyColor)
      }

      // sun.scale.set(sunP['scale'], sunP['scale'], sunP['scale'])
      // moon.scale.set(moonP['scale'], moonP['scale'], moonP['scale'])
      // phase.scale.set(moonP['scale'], moonP['scale'], moonP['scale'])

      phase.lookAt(sun.position.x * 1000, sun.position.y * 1000, sun.position.z * 1000)

      phase.material.color.set(adjustedSkyColor)
      // phase.material.color.setHex(0xff00ff)
      const adjustedMoonColor = new THREE.Color(
        blendColors(moonColor, '#' + adjustedSkyColor.getHexString(), intensity * 0.8)
      )
      moon.material.color.set(adjustedMoonColor)

      const sunA = new TWEEN.Tween(sun.position)
        .to(sunP.pos, tweenFuture)
        .start()

      const moonA = new TWEEN.Tween(moon.position)
        .to(moonP.pos, tweenFuture)
        .start()

      const phaseA = new TWEEN.Tween(phase.position)
        .to(moonP.pos, tweenFuture)
        .start()
    }
  }, 750)

  function botMove () {
    // move the sky if the player moves
    if (typeof bot.entity.position.x !== 'undefined') {
      skybox.position.x = bot.entity.position.x
      skybox.position.y = bot.entity.position.y
      skybox.position.z = bot.entity.position.z
    }
  }

  bot.on('move', botMove)
  botMove()
}
