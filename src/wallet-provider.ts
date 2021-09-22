const WalletConnectProvider: any = require("@walletconnect/web3-provider");
const QRCode: any = require("qrcode");

class WalletProvider
{
	provider: typeof WalletConnectProvider;
	accounts: string[];
	chainId: string;
	onAccountsChangedCallback: Function | undefined;
	onQrCodeCallback: Function | undefined;

	constructor()
	{
		this.provider = new WalletConnectProvider.default({
			"rpc": {
				"1": "https://cloudflare-eth.com/",
			},
			'clientMeta': {
				"name": "Test",
				"description": "Test",
				"url": "https://wildfiregames.com",
				"icons": ["https://wildfiregames.com/forum/uploads/profile/photo-thumb-9128.png"],
			},
			"qrcode": false,
		});
		this.provider.connector.on("display_uri", (err: any, payload: any) => {
			const uri = payload.params[0];
			console.log("open, URI is " + uri);
			// NB: the qr-codeification could be done elsewhere but seems fine here.
			QRCode.toString(uri, { "margin": 0, "type": "svg" }, (err: any, data: any) => {
				this.onQrCodeCallback(data);
			});
		});

		// Acts as 'log-in'
		this.provider.on("accountsChanged", (accs: any) => {
			console.log("Accounts: " + accs);
			this.accounts = accs;
			if (this.onAccountsChangedCallback)
				this.onAccountsChangedCallback(this.accounts);
		});

		this.provider.on("chainChanged", (cid: any) => {
			this.chainId = cid;
		});

		this.provider.on("disconnect", (code: any, reason: any) => {
			console.log(code, reason);
		});
	}

	onLogIn(callback: (accounts: string[]) => any): WalletProvider
	{
		this.onAccountsChangedCallback = callback;
		return this;
	}

	onQrCodeDisplay(callback: (svg: string) => any): WalletProvider
	{
		this.onQrCodeCallback = callback;
		return this;
	}

	enable(): WalletProvider
	{
		this.provider.enable();
		return this;
	}

	getProvider(): typeof WalletConnectProvider
	{
		return this.provider;
	}

	getAccount(): string
	{
		return this.accounts[0] ?? "";
	}
};

export default WalletProvider;
