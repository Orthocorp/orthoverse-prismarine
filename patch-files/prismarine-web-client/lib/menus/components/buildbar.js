const { LitElement, html, css } = require('lit')
const invsprite = require('../../invsprite.json')

const QUICK_BAR_COUNT = 9
const QUICK_BAR_START = 36

class BuildBar extends LitElement {
  static get styles () {
    return css`
      .buildbar {
        position: absolute;
        bottom: 2px;
        left: 2px;
        width: 20px;
        height:100px;
        background: url("textures/1.15.2/gui/buildbar.png");
      }

      #buildbar-items-wrapper {
        position: absolute;
        top: 0;
        left: 1px;
        display: flex;
        flex-direction: column;
        width: 22px;
        margin: 0;
        padding: 0;
      }

      .buildbar-item {
        position: relative;
        width: 20px;
        height: 20px;
      }

      .item-icon {
        top: 0px;
        left: 0px;
        position: absolute;
        width: 20px;
        height: 20px;
        transform-origin: top left;
        transform: scale(0.5);
      }

      .item-stack {
        position: absolute;
        color: white;
        font-size: 7px;
        font-family: minecraft, mojangles, monospace;
        text-shadow: 1px 1px 0 rgb(63, 63, 63);
        right: 2px;
        bottom: 1px;
      }

    `
  }

  static get properties () {
    return {
      displayBuildbar: {type: String},
      bot: { type: Object }
    }
  }

  constructor () {
    super()
    this.displayBuildbar = "none"
  }


  init (bot) {
    this.bot = bot
    console.log("Initializing buildbar")
    this.reloadBuildbar()

    document.addEventListener('wheel', (e) => {
      console.log("Wheel direction: ", Math.sign(e.deltaY))
      console.log("Active slot", this.bot.quickBarSlot)
      if (typeof this.bot.quickBarSlot === 'number') {
        let setValue = (this.bot.quickBarSlot + Math.sign(e.deltaY))
        // there should be a simple % way to do this
        if (setValue === QUICK_BAR_COUNT) { setValue = 0}
        if (setValue === -1) { setValue = QUICK_BAR_COUNT - 1}
        console.log("Set value for quickBarSlot is ", setValue)
        this.bot.setQuickBarSlot(setValue)
        console.log("Changed slot", this.bot.quickBarSlot)
        this.reloadBuildbar(this.bot.quickBarSlot)
      }
    })

    this.bot.inventory.on('updateSlot', (slot, oldItem, newItem) => {
      // doesn't affect the display if we're out of range of the buildbar
      if (Math.abs(this.bot.quickBarSlot + QUICK_BAR_START - slot) > 2) return
      const currentSlot = (slot - QUICK_BAR_START - this.bot.quickBarSlot + 2)
      const slotElement = this.shadowRoot.getElementById('buildbar-' + currentSlot)
      const slotIcon = slotElement.children[0]
      const slotStack = slotElement.children[1]
      if (newItem?.name) {
        const iconImg = '../../../extra-textures/blockboxes/' + newItem.name + '.png'
        slotIcon.innerHTML = "<img style='width: 40px; height: auto;' src='" +
        iconImg + 
        "'></img>"
      }
      slotStack.innerHTML = newItem?.count > 1 ? (newItem.count > 99 ? '99+' : newItem.count) : '0'
    })
  }

  async reloadBuildbar () {
    const activeSlot = this.bot.quickBarSlot
    console.log("Active slot", activeSlot)
    if (activeSlot) {
      for (let i = 0; i <= 4; i++) {
        const currentSlot = ((activeSlot - i + 2) % QUICK_BAR_COUNT) + QUICK_BAR_START
        console.log("Loop slot " + i.toString(), currentSlot)
        const item = this.bot.inventory.slots[currentSlot]
        console.log("Item", item)
        const slotElement = this.shadowRoot.getElementById('buildbar-' + i)
        const slotIcon = slotElement.children[0]
        const slotStack = slotElement.children[1]
        if (item?.name) {
            const iconImg = '../../../extra-textures/blockboxes/' + item.name + '.png'
            slotIcon.innerHTML = "<img style='width: 40px; height: auto;' src='" +
            iconImg + 
            "'></img>"
        }
      slotStack.innerHTML = item?.count > 1 ? (item.count > 99 ? '99+' : item.count) : '0'
      }
    }
  }

  async showBuildbar (visible) {
    if (visible === 'true') {
      this.displayBuildbar = "block"
    } else {
      this.displayBuildbar = "none"
    }
  }


  render () {
    return html`
      <div id="buildbar" class="buildbar" style="display: ${this.displayBuildbar}">
        <div id="buildbar-items-wrapper">
          <div class="buildbar-item" id="buildbar-0">
              <div class="item-icon">
              </div>
              <span class="item-stack"></span>
          </div>
          <div class="buildbar-item" id="buildbar-1">
              <div class="item-icon"></div>
              <span class="item-stack"></span>
          </div>
          <div class="buildbar-item" id="buildbar-2">
              <div class="item-icon"></div>
              <span class="item-stack"></span>
          </div>
          <div class="buildbar-item" id="buildbar-3">
              <div class="item-icon"></div>
              <span class="item-stack"></span>
          </div>
          <div class="buildbar-item" id="buildbar-4">
              <div class="item-icon"></div>
              <span class="item-stack"></span>
          </div>
        </div>
      </div>
    `
  }
}

window.customElements.define('pmui-buildbar', BuildBar)
