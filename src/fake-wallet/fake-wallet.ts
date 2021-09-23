import { Buffer } from 'buffer';
(global as any).Buffer = Buffer;

import WalletConnect from "@walletconnect/client";

/**
 * This code is a fake-wallet wrapper that can read a WalletConnect URI and log the user on,
 * as if using e.g. metamask.
 * The intent is for it to be usable on both frontend and backend code.
 */
class FakeWallet
{
	connector: WalletConnect | undefined;
	peerData: any;

	async initWalletConnect(uri: string)
	{
		try {
			console.log("Creating connector to", uri);
			// We don't want persistent storage so we need to explicitly pass a new storage ID.
			this.connector = new WalletConnect({ uri, storageId: uri });
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
				chainId: 1,
				// random fake address to make web3 happy.
				accounts: ["0x80d60bB57008d4cab28f4F28211DC7fE8Aea94fe"]
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

			try {
				var ret = this.answerQuery(payload.method, payload.params);
				this.connector.approveRequest({
					id: payload.id,
					result: ret,
				});
			}
			catch(e)
			{
				this.connector.rejectRequest({
					id: payload.id,
					error: { message: "There was an error processing the request." },
				});
			}
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
	}

	answerQuery(method: string, params: any): any
	{
		if (method === "eth_sign")
		{
			// Param 0 is adress, param 1 is data
			return params[0] + ":" + params[1];
		}
		throw new Error ("error");
	}
}

export default FakeWallet;
