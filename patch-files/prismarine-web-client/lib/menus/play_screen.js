const { LitElement, html, css } = require("lit");
const { commonCss, displayScreen } = require("./components/common");

const axios = require('axios')

class PlayScreen extends LitElement {
  static get styles() {
    return css`
      ${commonCss}
      .title {
        top: 12px;
      }

      .edit-boxes {
        position: absolute;
        top: 59px;
        left: 50%;
        display: flex;
        flex-direction: column;
        gap: 14px 0;
        transform: translate(-50%);
        width: 310px;
      }

      .wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 0 4px;
      }

      .button-wrapper {
        display: flex;
        flex-direction: row;
        gap: 0 4px;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%);
        width: 310px;
      }

      .extra-info-bv {
        font-size: 10px;
        color: rgb(206, 206, 206);
        text-shadow: 1px 1px black;
        position: absolute;
        left: calc(50% + 2px);
        bottom: -34px;
      }
    `;
  }

  static get properties() {
    return {
      server: { type: String },
      serverport: { type: Number },
      proxy: { type: String },
      proxyport: { type: Number },
      username: { type: String },
      password: { type: String },
      version: { type: String },
      walletAddress: { type: String },
    };
  }

  constructor() {
    super();
    this.server = "";
    this.serverport = 25565;
    this.proxy = "";
    this.proxyport = "";
    this.username = 'TestPlayer'
    this.password = "";
    this.version = "";
    this.walletAddress = "0x0000000000000000000000000000000000000000";
    this.avatarAPI = "";

    window
      .fetch("config.json")
      .then((res) => res.json())
      .then((config) => {
        console.log(config)
        this.server = config.defaultHost;
        this.serverport = config.defaultHostPort ?? 25565;
        this.proxy = config.defaultProxy;
        this.proxyport =
          !config.defaultProxy && !config.defaultProxyPort
            ? ""
            : config.defaultProxyPort ?? 443;
        this.version = config.defaultVersion;
        this.avatarAPI = config.avatarAPI
      });
  }

  render() {
    return html`
      <div class="dirt-bg"></div>

      <p class="title">Join a Server</p>

      <main class="edit-boxes">
        <div class="wrapper" style="display: none;">
          <pmui-editbox
            pmui-width="150px"
            pmui-label="Server IP"
            pmui-id="serverip"
            pmui-value="${this.server}"
            @input=${(e) => {
              this.server = e.target.value;
            }}
          ></pmui-editbox>
          <pmui-editbox
            pmui-width="150px"
            pmui-label="Server Port"
            pmui-id="port"
            pmui-value="${this.serverport}"
            @input=${(e) => {
              this.serverport = e.target.value;
            }}
          ></pmui-editbox>
        </div>
        <div class="wrapper" style="display: none;">
          <pmui-editbox
            pmui-width="150px"
            pmui-label="Proxy"
            pmui-id="proxy"
            pmui-value="${this.proxy}"
            @input=${(e) => {
              this.proxy = e.target.value;
            }}
          ></pmui-editbox>
          <pmui-editbox
            pmui-width="150px"
            pmui-label="Port"
            pmui-id="port"
            pmui-value="${this.proxyport}"
            @input=${(e) => {
              this.proxyport = e.target.value;
            }}
          ></pmui-editbox>
        </div>
        <div class="wrapper" style="display: none;">
          <pmui-editbox
            pmui-width="220px"
            pmui-label="Username"
            pmui-id="username"
            pmui-value="${this.username}"
            @input=${(e) => {
              this.username = e.target.value;
            }}
          ></pmui-editbox>
          <pmui-editbox
            style="display: none;"
            pmui-width="150px"
            pmui-label="Bot Version"
            pmui-id="botversion"
            pmui-value="${this.version}"
            @input=${(e) => {
              this.version = e.target.value;
            }}
          ></pmui-editbox>
        </div>
        <div class="wrapper">
          <pmui-button
            pmui-width="220px"
            pmui-label="Log on with MetaMask"
            @pmui-click=${this.onMetamaskPress}
          ></pmui-button>
        </div>
        <div class="wrapper">
          <pmui-button
            pmui-width="220px"
            pmui-label="Log on with WalletConnect"
            @pmui-click=${this.onWalletConnectPress}
          ></pmui-button>
        </div>
        <div class="wrapper">
          <pmui-button
            pmui-width="220px"
            pmui-label="Log on as guest"
            @pmui-click=${this.onConnectPress}
          ></pmui-button>
        </div>

        <div class="wrapper">
          <pmui-button
            pmui-width="220px"
            pmui-label="Cancel"
            @pmui-click=${() =>
              displayScreen(this, document.getElementById("title-screen"))}
          ></pmui-button>
        </div>
      </main>
      ${this.loadScript("https://unpkg.com/web3@1.7.4/dist/web3.min.js")}
      ${this.loadScript("https://unpkg.com/web3modal@1.9.8/dist/index.js")}
      ${this.loadScript(
        "https://unpkg.com/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js"
      )}
    `;
  }

  // !!Because writing <script></script> in render does not work
  loadScript(url) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    return script;
  }

  async getName(address) {
    console.log("Axios getName for " + this.avatarAPI + 'nameFromAddress?id=' + address)
    return axios.get(this.avatarAPI + 'nameFromAddress?id=' + address)
      .then(response => {
        console.log("This was the Axios response")
        console.log(response.data.name)
        return response.data.name
      })
      .catch(err => {
        console.log("Axios error")
        console.log(err)
        return "NameError"
      })
  }

  async onWalletConnectPress() {
    // Unpkg imports
    const Web3Modal = window.Web3Modal.default;
    const WalletConnectProvider = window.WalletConnectProvider.default;

    // Web3modal instance
    let web3Modal;

    // Chosen wallet provider given by the dialog window
    let provider;

    // console.log("Initializing...");
    // console.log("WalletConnectProvider is", WalletConnectProvider);
    // console.log(
    //   "window.web3 is",
    //   window.web3,
    //   "window.ethereum is",
    //   window.ethereum
    // );

    // Tell Web3modal what providers we have available.
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // Infura Orthoverse Land Id
          infuraId: "f7b9775130db4d889f1f6026ccee59d0",
        },
      },
    };

    web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: true, // !!Must Disable injected provider (Metamask / Brave / Opera) or the popup will not open
    });

    // console.log("Web3Modal instance is", web3Modal);
    // console.log("Opening a dialog", web3Modal);

    try {
      provider = await web3Modal.connect();
      this.web3wc = new Web3(provider);

      // Get list of accounts of the connected wallet
      const accounts = await this.web3wc.eth.getAccounts();
      // MetaMask does not give you all accounts, only the selected account
      // console.log("Got accounts", accounts);
      this.walletAddress = accounts[0];
      console.log("Wallet connected: " + this.walletAddress);
      this.onConnectPress()
    } catch (error) {
      console.log("Could not get a wallet connection", error);
      console.log(error, error.code);
      // 4001 - The request was rejected by the user
      // -32602 - The parameters were invalid
      // -32603- Internal error
    }
  }

  onMetamaskPress() {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          this.walletAddress = accounts[0];
          console.log("Wallet connected: " + this.walletAddress);
          this.onConnectPress()
        })
        .catch((error) => {
          console.log(error, error.code);
          // 4001 - The request was rejected by the user
          // -32602 - The parameters were invalid
          // -32603- Internal error
        });
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  }

  onConnectPress() {
    this.getName(this.walletAddress)
    .then( name => {
      this.username = name
      this.dispatchEvent(
        new window.CustomEvent("connect", {
          detail: {
            server: `${this.server}:${this.serverport}`,
            proxy: `${this.proxy}${
              this.proxy !== "" ? `:${this.proxyport}` : ""
            }`,
            username: this.username,
            password: "",
            botVersion: this.version,
          },
        })
      );
    })
    .catch((error) => {
      console.log(error, error.code);  
    })
  }
}

window.customElements.define("pmui-playscreen", PlayScreen);
