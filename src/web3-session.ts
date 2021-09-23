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
		ipcMain.on('web3', async (event: any, arg: any) => {
			if (!this.web3)
				throw "Web3 session not set up yet.";
			console.log("query: ", arg);
			if (arg.query === "balance")
				event.returnValue = await this.getBalance();
			else if (arg.query === "sign")
				event.returnValue = await this.sign(arg.data);
			else
				event.returnValue = "";
		})
	}

	setUp(provider: typeof WalletProvider)
	{
		this.provider = provider;
		this.web3 = new Web3(provider.getProvider());
	}

	async getBalance()
	{
		console.log("getting balance of ", this.provider.getAccount());
		var balance = await this.web3.eth.getBalance(this.provider.getAccount(), "latest");
		return +balance;
	}

	async sign(data)
	{
		console.log("Signing");
		var res = await this.web3.eth.sign(data, this.provider.getAccount());
		console.log("got", res);
		return res;
	}
}

export default Web3Session;