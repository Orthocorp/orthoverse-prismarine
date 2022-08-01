const lands = require('../../../lands/voxel.json')

const { LitElement, html, css } = require('lit')

const MAX_ROWS_PER_COL = 10

class PalantirContainer extends LitElement {
  static get styles() {
    return css`
      .palantir-container {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        top: 9px;
        left: 50%;
        transform: translate(-50%);
        width: fit-content;
        padding: 1px;
        display: flex;
        flex-direction: column;
        gap: 1px 0;
        place-items: center;
        z-index: 30;
      }

      .title {
        color: white;
        text-shadow: 1px 1px 0px #3f3f3f;
        font-size: 10px;
        margin: 0;
        padding: 0;
      }

      .playerlist-entry {
        overflow: hidden;
        color: white;
        font-size: 10px;
        margin: 0px;
        line-height: calc(100% - 1px);
        text-shadow: 1px 1px 0px #3f3f3f;
        font-family: mojangles, minecraft, monospace;
        background: rgba(255, 255, 255, 0.1);
        width: 100%;
      }

      .active-player {
        color: rgb(42, 204, 237);
        text-shadow: 1px 1px 0px rgb(4, 44, 67);
      }

      .playerlist-land {
        text-align: right;
        float: right;
        padding-left: 10px;
      }

      .playerlist-land-name {
        color: rgb(114, 255, 114);
        text-shadow: 1px 1px 0px rgb(28, 105, 28);
        float: left;
        margin: 0;
        margin-right: 1px;
      }

      .player-lists {
        display: flex;
        flex-direction: row;
        place-items: center;
        place-content: center;
        gap: 0 4px;
      }

      .player-list {
        display: flex;
        flex-direction: column;
        gap: 1px 0;
        min-width: 80px;
      }
    `
  }

  static get properties() {
    return {
      serverIP: { type: String },
      clientId: { type: String },
      players: { type: Object },
    }
  }

  constructor() {
    super()
    this.serverIP = ''
    this.clientId = ''
    this.players = {}
    this.panelOpened = false
  }

  init(bot, ip) {
    const playerList = this.shadowRoot.querySelector('#palantir-container')

    this.players = bot.players
    this.clientId = bot.player.uuid
    this.serverIP = ip

    if (this.panelOpened) {
      this.requestUpdate()

      console.log('**** Palantir Init', this.players)

      bot.on('playerUpdated', () => this.requestUpdate()) // LitElement seems to be batching requests, so it should be fine?
      bot.on('playerJoined', () => this.requestUpdate())
      bot.on('playerLeft', () => this.requestUpdate())
    }
  }

  render() {
    if (this.panelOpened) {
      const landnameFor = function (player) {
        const x = Math.floor(player?.entity.position.x / (16 * 6))
        const z = Math.floor(player?.entity.position.z / (16 * 6))
        let landName = ''
        if (x !== undefined && z !== undefined) {
          const landKey = x.toString() + ':' + z.toString()

          if (landKey in lands) {
            landName = 'now in ' + lands[landKey][1]
          } else {
            landName = 'now in The Open Sea'
          }
        }

        console.log('***', player.username, landName)
        return landName
      }

      const lists = []
      const players = Object.values(this.players).sort((a, b) => {
        if (a.username > b.username) return 1
        if (a.username < b.username) return -1
        return 0
      })

      let tempList = []
      for (let i = 0; i < players.length; i++) {
        tempList.push(players[i])

        if ((i + 1) / MAX_ROWS_PER_COL === 1 || i + 1 === players.length) {
          lists.push([...tempList])
          tempList = []
        }
      }

      //console.log('**** Palantir Render', lists)

      return html`
        <div class="palantir-container" id="palantir-container">
          <span class="title">Connected Users</span>
          <div class="player-lists">
            ${lists.map(
              (list) => html`
                <div class="player-list">
                  ${list.map(
                    (player) => html`
                      <div
                        class="playerlist-entry${this.clientId === player.uuid
                          ? ' active-player'
                          : ''}"
                        id="plist-player-${player.uuid}"
                      >
                        ${player.username}
                        <div class="playerlist-land">
                          <p class="playerlist-land-name">
                            ${landnameFor(player)}
                          </p>
                        </div>
                      </div>
                    `
                  )}
                </div>
              `
            )}
          </div>
        </div>
      `
    }
  }
}

window.customElements.define('pmui-palantir-container', PalantirContainer)
