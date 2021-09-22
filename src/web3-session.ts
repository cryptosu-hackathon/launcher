const Web3: any = require("web3");
const { ipcMain } = require('electron')
const WalletProvider = require('./wallet-provider');

class Web3Session
{
	web3: typeof Web3 | undefined;
	provider: typeof WalletProvider | undefined;
	constructor()
	{
		// Route all web3 messages here.
		ipcMain.on('web3', (event: any, arg: any) => {
			if (!this.web3)
				throw "Web3 session not set up yet.";
			console.log("query: ", arg);
			if (arg.query === "balance")
				event.returnValue = this.getBalance();
			else
				event.returnValue = "";
		})
	}

	setUp(provider: typeof WalletProvider)
	{
		this.provider = provider;
		this.web3 = new Web3(provider);
	}

	async getBalance()
	{
		console.log("getting balance");
		var balance = await this.web3.eth.getBalance(this.provider.getAccount(), "latest");
		console.log("got");
		console.log(balance);
		return balance;
	}
}

export default Web3Session;