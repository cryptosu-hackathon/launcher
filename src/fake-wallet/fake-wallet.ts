import { Buffer } from 'buffer';
(global as any).Buffer = Buffer;

import WalletConnect from "@walletconnect/client";

class FakeWallet
{
	connector: WalletConnect | undefined;
	peerData: any;

	async initWalletConnect(uri: string)
	{
		try {
			console.log("Creating connector to", uri);
			this.connector = new WalletConnect({ uri });
			if (this.connector.connected)
				await this.connector.killSession();
			await this.connector.createSession();
			console.log("Created", this.connector.connected);
			this.subscribeToEvents();
		} catch (error) {
			throw error;
		}
	};

	subscribeToEvents()
	{
		if (!this.connector)
			throw new Error("No connector");

		this.connector.on("session_request", (error, payload) => {
			console.log("session rq ", error, payload);
			if (error)
				throw error;

			this.peerData = payload.params[0];
			console.log("SESSION_REQUEST from ", this.peerData);


			this.connector.approveSession({
				chainId: 5,
				accounts: ["0xFOOBARBAR"]
			});
		});

		this.connector.on("session_update", error => {
			console.log("EVENT", "session_update");

			if (error)
				throw error;
		});

		this.connector.on("call_request", async (error, payload) => {
			console.log("EVENT", "call_request", "method", payload.method);
			console.log("EVENT", "call_request", "params", payload.params);

			if (error)
				throw error;

			//await getAppConfig().rpcEngine.router(payload, this.state, this.bindedSetState);
		});

		this.connector.on("connect", (error, payload) => {
			console.log("EVENT", "connect");

			if (error)
				throw error;
		});

		this.connector.on("disconnect", (error, payload) => {
			console.log("EVENT", "disconnect");

			if (error)
				throw error;
		});
		/*
		if (connector.connected) {
			const { chainId, accounts } = connector;
			const index = 0;
			const address = accounts[index];
			getAppControllers().wallet.update(index, chainId);
			this.setState({
				connected: true,
				address,
				chainId,
			});
		}*/
	}
}

export default FakeWallet;
	/*
	public approveSession = () => {
		console.log("ACTION", "approveSession");
		const { connector, chainId, address } = this.state;
		if (connector) {
			connector.approveSession({ chainId, accounts: [address] });
		}
		this.setState({ connector });
	};

	public rejectSession = () => {
		console.log("ACTION", "rejectSession");
		const { connector } = this.state;
		if (connector) {
			connector.rejectSession();
		}
		this.setState({ connector });
	};

	public killSession = () => {
		console.log("ACTION", "killSession");
		const { connector } = this.state;
		if (connector) {
			connector.killSession();
		}
		this.resetApp();
	};

	public resetApp = async () => {
		await this.setState({ ...INITIAL_STATE });
		this.init();
	};

	public updateSession = async (sessionParams: { chainId?: number; activeIndex?: number }) => {
		const { connector, chainId, accounts, activeIndex } = this.state;
		const newChainId = sessionParams.chainId || chainId;
		const newActiveIndex = sessionParams.activeIndex || activeIndex;
		const address = accounts[newActiveIndex];
		if (connector) {
			connector.updateSession({
				chainId: newChainId,
				accounts: [address],
			});
		}
		await this.setState({
			connector,
			address,
			accounts,
			activeIndex: newActiveIndex,
			chainId: newChainId,
		});
		await getAppControllers().wallet.update(newActiveIndex, newChainId);
		await getAppConfig().events.update(this.state, this.bindedSetState);
	};

	public updateChain = async (chainId: number | string) => {
		await this.updateSession({ chainId: Number(chainId) });
	};

	public updateAddress = async (activeIndex: number) => {
		await this.updateSession({ activeIndex });
	};

	public toggleScanner = () => {
		console.log("ACTION", "toggleScanner");
		this.setState({ scanner: !this.state.scanner });
	};

	public onQRCodeValidate = (data: string): IQRCodeValidateResponse => {
		const res: IQRCodeValidateResponse = {
			error: null,
			result: null,
		};
		try {
			res.result = data;
		} catch (error) {
			res.error = error;
		}

		return res;
	};

	public onQRCodeScan = async (data: any) => {
		const uri = typeof data === "string" ? data : "";
		if (uri) {
			await this.setState({ uri });
			await this.initWalletConnect();
			this.toggleScanner();
		}
	};

	public onURIPaste = async (e: any) => {
		const data = e.target.value;
		const uri = typeof data === "string" ? data : "";
		if (uri) {
			await this.setState({ uri });
			await this.initWalletConnect();
		}
	};

	public onQRCodeError = (error: Error) => {
		throw error;
	};

	public onQRCodeClose = () => this.toggleScanner();

	public openRequest = async (request: any) => {
		const payload = Object.assign({}, request);

		const params = payload.params[0];
		if (request.method === "eth_sendTransaction") {
			payload.params[0] = await getAppControllers().wallet.populateTransaction(params);
		}

		this.setState({
			payload,
		});
	};

	public closeRequest = async () => {
		const { requests, payload } = this.state;
		const filteredRequests = requests.filter(request => request.id !== payload.id);
		await this.setState({
			requests: filteredRequests,
			payload: null,
		});
	};

	public approveRequest = async () => {
		const { connector, payload } = this.state;

		try {
			await getAppConfig().rpcEngine.signer(payload, this.state, this.bindedSetState);
		} catch (error) {
			console.error(error);
			if (connector) {
				connector.rejectRequest({
					id: payload.id,
					error: { message: "Failed or Rejected Request" },
				});
			}
		}

		this.closeRequest();
		await this.setState({ connector });
	};

	public rejectRequest = async () => {
		const { connector, payload } = this.state;
		if (connector) {
			connector.rejectRequest({
				id: payload.id,
				error: { message: "Failed or Rejected Request" },
			});
		}
		await this.closeRequest();
		await this.setState({ connector });
	};*/
