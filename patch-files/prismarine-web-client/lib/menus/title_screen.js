const { openURL, displayScreen } = require("./components/common");
const { LitElement, html, css } = require("lit");

const slogan = [
  "   WITH EXTRA DOOM!",
  "   GARLIC FOREVER!!",
  "  THE ONION'S A LIE!",
  "     HENGES RULE!",
  "   WHY SOME GARLIC?",
  "    FLIP FOR FUN",
  "A QUINDECILLION IS BIG",
];

const n = Math.floor(Math.random() * slogan.length);

class TitleScreen extends LitElement {
  static get styles() {
    return css`
      .minecraft {
        position: absolute;
        top: 30px;
        left: calc(50% - 128px);
      }

      .minecraft .minec {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        background-image: url("extra-textures/orthoverse.png");
        background-size: 256px;
        width: 256px;
        height: 68px;
      }

      .minecraft .raft {
        display: block;
        position: absolute;
        top: 0;
        left: 155px;
        background-image: url("textures/1.17.1/gui/title/minecraft.png");
        background-size: 256px;
        width: 155px;
        height: 44px;
        background-position-y: -45px;
      }

      .minecraft .edition {
        display: block;
        position: absolute;
        top: 37px;
        left: calc(88px + 5px);
        background-image: url("extra-textures/edition.png");
        background-size: 128px;
        width: 88px;
        height: 14px;
      }

      .splash {
        position: absolute;
        top: 82px;
        left: 227px;
        color: #0ff;
        transform: translate(-110%, -100%) rotateZ(1deg) scale(1);
        width: max-content;
        text-shadow: 1px 1px #022;
        font-size: 10px;
        animation: splashAnim 800ms infinite alternate linear;
      }

      @keyframes splashAnim {
        to {
          transform: translate(-110%, -100%) rotateZ(-1deg) scale(1.05);
        }
      }

      .menu {
        display: flex;
        flex-direction: column;
        gap: 4px 0;
        position: absolute;
        top: calc(25% + 48px);
        left: 50%;
        width: 200px;
        transform: translate(-50%);
      }

      .menu-row {
        display: flex;
        flex-direction: row;
        gap: 0 4px;
        width: 100%;
      }

      .bottom-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: absolute;
        bottom: -1px;
        left: 1px;
        width: calc(100% - 2px);
        color: white;
        text-shadow: 1px 1px #222;
        font-size: 10px;
      }
    `;
  }

  render() {
    return html`
      <div class="minecraft">
        <div class="minec"></div>
        <span class="splash">${slogan[n]}</span>
      </div>

      <div class="menu">
        <pmui-button
          pmui-width="200px"
          pmui-label="Play"
          @pmui-click=${() =>
            displayScreen(this, document.getElementById("play-screen"))}
        ></pmui-button>
        <pmui-button
          pmui-width="200px"
          pmui-label="Options"
          @pmui-click=${() =>
            displayScreen(this, document.getElementById("options-screen"))}
        ></pmui-button>

        <pmui-button
          pmui-width="200px"
          pmui-label="Reveal Your Land Token"
          @pmui-click=${() => openURL("https://orthoverse.io")}
        ></pmui-button>
        <pmui-button
          pmui-width="200px"
          pmui-label="Read The Degen's Guide"
          @pmui-click=${() =>
            openURL("https://orthoverse.io/orthoverse-degens-guide.pdf")}
        ></pmui-button>
      </div>

      <div class="bottom-info">
        <span>Powered by <a href="https://prismarine.js.org/" style="color: #D7A0D4">PrismarineJS</a></span>
        <span>Textures by <a href="http://www.andrejolicoeur.com/" style="color: #D7A0D4">André Jolicoeur</a></span>
      </div>
    `;
  }
}

window.customElements.define("pmui-titlescreen", TitleScreen);
