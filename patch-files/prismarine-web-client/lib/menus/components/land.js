const { LitElement, html, css } = require('lit')
const lands = require('../../../lands/voxel.json')

class LandBar extends LitElement {
  static get styles() {
    return css`
      .landbar {
        position: absolute;
        right: 2px;
        top: 2px;
        height: 96px;
        width: 96px;
      }

      .land-name {
        font-size: 10px;
        font-family: zxortho, monospace;
        font-weight: bold;
        text-align: center;
        text-shadow: 1px 1px 3px #ffffff, -1px -1px 3px #ffffff,
          1px -1px 3px #ffffff, -1px 1px 3px #ffffff;
      }

      .land-crown {
        padding: 0;
        margin: 0;
        border: 0;
        text-align: center;
        padding-bottom: 0;
      }

      .land-shield {
        padding: 0;
        margin: 0;
        text-align: center;
      }

      #compass {
        position: absolute;
        bottom: 2px;
        right: 2px;
        height: 40px;
        width: 40px;
        padding: 0;
        margin: 0;
        text-align: center;
      }
      #boots {
        position: absolute;
        bottom: 44px;
        right: 2px;
        height: 40px;
        width: 40px;
        padding: 0;
        margin: 0;
        text-align: center;
      }
      #palantir {
        position: absolute;
        bottom: 84px;
        right: 2px;
        height: 40px;
        width: 40px;
        padding: 0;
        margin: 0 0 5px 0;
        text-align: center;
      }
    `
  }

  static get properties() {
    return {
      landName: { type: String },
      landColor: { type: String },
      landShield: { type: String },
      landCrown: { type: String },
      bootImg: { type: String },
      palantirImg: { type: String },
    }
  }

  constructor() {
    super()
    this.landName = lands['0:0'][1]
    this.landColor = '#000000'
    this.landShield = '../../../extra-textures/escutcheons/' + lands['0:0'][3]
    this.landCrown = '../../../extra-textures/crown7.png'
    this.bootImg = '../../../extra-textures/boot-dark.png'
    this.palantirImg = '../../../extra-textures/palantir-dark.png'
  }

  async updateLand(x, z) {
    const landKey = x.toString() + ':' + z.toString()
    if (landKey in lands) {
      this.landName = lands[landKey][1]
      const shield = lands[landKey][3]
      if (shield === 'none') {
        this.landShield = '../../../extra-textures/escutcheons/none.png'
      } else {
        this.landShield =
          '../../../extra-textures/escutcheons/' + lands[landKey][3]
      }
      const adjustedLevel = lands[landKey][2] % 8
      this.landCrown =
        '../../../extra-textures/crown' + adjustedLevel.toString() + '.png'
    } else {
      this.landName = 'The Open Sea'
      this.landShield = '../../../extra-textures/escutcheons/none.png'
      this.landCrown = '../../../extra-textures/crown0.png'
    }
  }

  async updateDir(dir) {
    this.shadowRoot.querySelector('#compass').style.transform =
      'rotate(' + dir.toString() + 'rad)'
  }

  async bootswap(light) {
    if (light === true) {
      this.bootImg = '../../../extra-textures/boot-light.png'
    } else {
      this.bootImg = '../../../extra-textures/boot-dark.png'
    }
  }

  async landnameswap(light) {
    if (light === 'true') {
      this.landColor = '#0000ff'
    } else {
      this.landColor = '#000000'
    }
  }

  async palantirswap(light) {
    if (light === true) {
      this.palantirImg = '../../../extra-textures/palantir-light.png'
    } else {
      this.palantirImg = '../../../extra-textures/palantir-dark.png'
    }
  }
  render() {
    return html`
      <div id="landbar" class="landbar">
        <div class="land-name" style="color: ${this.landColor}">${this.landName}</div>
        <div class="land-crown" id="crown">
          <img style="width: 40px; height: auto;" src=${this.landCrown}></img>
       </div>
        <div class="land-shield">
          <img style="width: 40px; height: auto;" src=${this.landShield}></img>
        </div>
      </div>
      <div id="boots">
        <img style="width: 40px; height: auto;" src=${this.bootImg}><img/>
      </div>
      <div id="palantir">
        <img style="width: 40px; height: auto;" src=${this.palantirImg}><img/>
      </div>
      <div id="compass">
        <img style="width: 40px; height: auto;" src="../../../extra-textures/compass.png"><img/>
      </div>
    `
  }
}

window.customElements.define('pmui-landbar', LandBar)
