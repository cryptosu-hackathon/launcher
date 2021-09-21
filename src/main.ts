import { app, BrowserWindow } from "electron";
import * as path from "path";

var glob_path = process.env.NODE_ENV === 'development' ? 'localhost:8080' : __dirname;
glob_path = __dirname;

declare global {
    interface Window { ipc: any; }
}

var mainWindow: BrowserWindow;
function createWindow()
{
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(glob_path, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(glob_path, "index.html"));

  // Use navbar
  // mainWindow.webContents.openDevTools();
}

var onLogged: any;
var provider: any;

var accounts: any;
var chainId: any;
var qrCode: any;
async function totoro_web3()
{
  const WalletConnectProvider: any = require("@walletconnect/web3-provider");
  const QRCode: any = require("qrcode");
  provider = new WalletConnectProvider.default({
    "rpc": {
      "1": "https://cloudflare-eth.com/",
      // ...
    },
    'clientMeta': {
      "name": "Lancelot Test",
      "description": "Test de Lancelot",
      "url": "https://wildfiregames.com",
      "icons": ["https://wildfiregames.com/forum/uploads/profile/photo-thumb-9128.png"],
    },
    "qrcode": false,
  });

  provider.connector.on("display_uri", (err: any, payload: any) => {
    const uri = payload.params[0];
    console.log("open, URI is " + uri);
    QRCode.toString(uri, { "margin": 0, "type": "svg" }, (err: any, data: any) => {
      console.log("sending");
      qrCode = data;
      mainWindow.webContents.send('qr-code', data);
    });
  });

  // Subscribe to accounts change
  provider.on("accountsChanged", (accs: any) => {
    accounts = accs;
    console.log("Accounts: " + accs);
    setTimeout(onLogged, 100);
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (cid: any) => {
    chainId = cid;
  });

  // Subscribe to session disconnection
  provider.on("disconnect", (code: any, reason: any) => {
    console.log(code, reason);
  });

  await provider.enable();
}

onLogged = function()
{
  const keccak256: any = require("keccak256");
  const Web3: any = require("web3");
  const web3: any = new Web3(provider);
  console.log("starting");
  web3.eth.getAccounts().then(x => console.log("accounts: " + x)).catch(x => console.log(x));
  web3.eth.getBalance(accounts[0], "latest").then(x => console.log("balance: " + x)).catch(x => console.log(x));
  let message = "Hello World";
  web3.eth.sign("0x"+keccak256("\x19Ethereum Signed Message:\n" + message.length + message).toString('hex'), accounts[0])
    .then(x => console.log("signed:" +x)).catch(x => console.log(x));
};

const { ipcMain } = require('electron')
ipcMain.on('qr-code', (event: any, arg: any) => {
  event.reply('qr-code', qrCode);
})

app.on("ready", () => {
  createWindow();
  totoro_web3();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});

app.on("window-all-closed", () => {
  //if (process.platform !== "darwin")
    app.quit();
});
