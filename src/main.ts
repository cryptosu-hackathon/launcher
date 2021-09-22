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
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(glob_path, "preload.js"),
		},
	});

	mainWindow.loadFile(path.join(glob_path, "index.html"));

	// Or use navbar
	mainWindow.webContents.openDevTools();
}

import Web3Session from './web3-session';
var web3session = new Web3Session();

import WalletProvider from './wallet-provider'

var qrCode: any;
var provider = new WalletProvider();
provider.onQrCodeDisplay((uri: string, svg: string) => {
		qrCode = { uri, svg };
		if (mainWindow)
			mainWindow.webContents.send('qr-code', { uri, svg });
	})
	.onLogIn(accounts => {
		const keccak256: any = require("keccak256");
		web3session.setUp(provider.getProvider());
		// no need to check, qrCode step requires the window to be setup
		mainWindow.webContents.send('logged-on', true);
		/*
		console.log("starting");
		web3.eth.getAccounts().then(x => console.log("accounts: " + x)).catch(x => console.log(x));
		web3.eth.getBalance(accounts[0], "latest").then(x => console.log("balance: " + x)).catch(x => console.log(x));
		let message = "Hello World";
		web3.eth.sign("0x"+keccak256("\x19Ethereum Signed Message:\n" + message.length + message).toString('hex'), accounts[0])
			.then(x => console.log("signed:" +x)).catch(x => console.log(x));	
		*/
	})
	.enable();

//import FakeWallet from './fake-wallet/fake-wallet'
//var fakeWallet = new FakeWallet();

app.on("ready", () => {
	createWindow();
	mainWindow.webContents.once('dom-ready', () => {
		// May be redundant with qrCodeDisplay but that's OK.
		mainWindow.webContents.send('qr-code', qrCode);
		//fakeWallet.initWalletConnect(qrCode.uri);
	});

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow();
	});
});

app.on("window-all-closed", () => {
	//if (process.platform !== "darwin")
		app.quit();
});
