const { LitElement, html, css } = require('lit')
const invsprite = require('../../invsprite.json')

class Hotbar extends LitElement {
  static get styles () {
    return css`
      .hotbar {
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        width: 182px;
        height: 22px;
        background: url("textures/1.15.2/gui/widgets.png");
        background-size: 256px;
      }

      #hotbar-selected {
        position: absolute;
        left: -1px;
        top: -1px;
        width: 24px;
        height: 24px;
        background: url("textures/1.15.2/gui/widgets.png");
        background-size: 256px;
        background-position-y: -22px;
      }

      #hotbar-items-wrapper {
        position: absolute;
        top: 0;
        left: 1px;
        display: flex;
        flex-direction: row;
        height: 22px;
        margin: 0;
        padding: 0;
      }

      .hotbar-item {
        position: relative;
        width: 20px;
        height: 22px;
      }

      .item-icon {
        top: 3px;
        left: 2px;
        position: absolute;
        width: 32px;
        height: 32px;
        transform-origin: top left;
        transform: scale(0.5);
        background-image: url('invsprite.png');
        background-size: 1024px auto;
      }

      .item-stack {
        position: absolute;
        color: white;
        font-size: 10px;
        text-shadow: 1px 1px 0 rgb(63, 63, 63);
        right: 1px;
        bottom: 1px;
      }

      #hotbar-item-name {
        color: white;
        position: absolute;
        bottom: 51px;
        left: 50%;
        transform: translate(-50%);
        text-shadow: rgb(63, 63, 63) 1px 1px 0px;
        font-family: zxortho, monospace;
        font-size: 10px;
        text-align: center;
      }

      .hotbar-item-name-fader {
        opacity: 0;
        transition: visibility 0s, opacity 1s linear;
        transition-delay: 2s;
      }
    `
  }

  static get properties () {
    return {
      activeItemName: { type: String },
      bot: { type: Object },
      viewerVersion: { type: String },
      frameStart : { type: Number }
    }
  }

  constructor () {
    super()
    this.activeItemName = ''
    this.frameStart = 0
  }

  updated (changedProperties) {
    if (changedProperties.has('bot')) {
      // inventory listener
      this.bot.once('spawn', () => {
        this.init()
      })
    }
  }

  init () {
    console.log("Initializing hotbar")
    const QUICK_BAR_COUNT = 36
    const QUICK_BAR_START = 9

    this.reloadHotbar()
    this.reloadHotbarSelected(0)

    document.addEventListener('wheel', (e) => {
      console.log("Rolled wheel " + e.deltaY.toString())
      let newSlot = (this.bot.quickBarSlot + Math.sign(e.deltaY))
      if (newSlot > QUICK_BAR_COUNT - 1) { newSlot = QUICK_BAR_COUNT - 1 }
      if (newSlot < 0) { newSlot = 0 }
      if (newSlot > this.frameStart + 8) {
        this.frameStart = this.frameStart + 1
        if (this.frameStart > QUICK_BAR_COUNT - 9) { this.frameStart = QUICK_BAR_COUNT -9 }
      }
      if (newSlot < this.frameStart) {
        this.frameStart = this.frameStart - 1
        if (this.frameStart < 0) { this.frameStart = 0 }
      }
      console.log("newSlot: ", newSlot)
      console.log("frameStart: ", this.frameStart)
      this.reloadHotbar()
      this.reloadHotbarSelected (newSlot)
    })

    document.addEventListener('keydown', (e) => {
      if (e.code.slice(0,5) !== 'Digit') return
      const numPressed = e.code.substr(5)
      const isShift = !!e.shiftKey
        // replacing hotbar quickselect with save
        // this.reloadHotbarSelected(numPressed - 1)
      if (isShift) {
        bot._client.writeChannel('ethereum', 'load:' + numPressed)
      } else {
        bot._client.writeChannel('ethereum', 'save:' + numPressed)
      }
    })

    this.bot.inventory.on('updateSlot', (invslot, oldItem, newItem) => {
      if (invslot >= this.bot.inventory.hotbarStart  + this.frameStart + 9) return
      if (invslot < this.bot.inventory.hotbarStart + this.frameStart) return

      const sprite = newItem ? invsprite[newItem.name] : invsprite.air
      console.log("Sprite is this: ", sprite)
      console.log("Slot is this: ", invslot)
      const slotEl = this.shadowRoot.getElementById('hotbar-' + (invslot - this.bot.inventory.hotbarStart - this.frameStart))
      const slotIcon = slotEl.children[0]
      const slotStack = slotEl.children[1]
      slotIcon.style['background-position-x'] = `-${sprite.x}px`
      slotIcon.style['background-position-y'] = `-${sprite.y}px`
      slotStack.innerHTML = newItem?.count > 1 ? newItem.count : ''
    })
  }

  async reloadHotbar () {
    console.log("Reloading hotbar")
    for (let i = 0; i < 9; i++) {
      const item = this.bot.inventory.slots[this.bot.inventory.hotbarStart + this.frameStart + i]
      const sprite = item ? invsprite[item.name] : invsprite.air
      const slotEl = this.shadowRoot.getElementById('hotbar-' + i)
      const slotIcon = slotEl.children[0]
      const slotStack = slotEl.children[1]
      slotIcon.style['background-position-x'] = `-${sprite.x}px`
      slotIcon.style['background-position-y'] = `-${sprite.y}px`
      slotStack.innerHTML = item?.count > 1 ? item.count : ''
    }
  }

  async reloadHotbarSelected (slot) {
    const item = this.bot.inventory.slots[this.bot.inventory.hotbarStart + slot]
    const newLeftPos = (-1 + 20 * (slot - this.frameStart)) + 'px'
    this.shadowRoot.getElementById('hotbar-selected').style.left = newLeftPos
    this.bot.setQuickBarSlot(slot)
    this.activeItemName = item?.displayName ?? ''
    const name = this.shadowRoot.getElementById('hotbar-item-name')
    name.classList.remove('hotbar-item-name-fader')
    setTimeout(() => name.classList.add('hotbar-item-name-fader'), 10)
  }

  render () {
    return html`
      <div class="hotbar">
        <p id="hotbar-item-name">${this.activeItemName}</p>
        <div id="hotbar-selected"></div>
        <div id="hotbar-items-wrapper">
          <div class="hotbar-item" id="hotbar-0">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-1">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-2">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-3">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-4">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-5">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-6">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-7">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
          <div class="hotbar-item" id="hotbar-8">
            <div class="item-icon"></div>
            <span class="item-stack"></span>
          </div>
        </div>
      </div>
    `
  }
}

window.customElements.define('pmui-hotbar', Hotbar)
