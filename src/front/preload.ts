const { ipcRenderer } = require('electron');
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipc', {
	"send": (type: string, data: any) => {
		ipcRenderer.send(type, data);
	},
	"sendSync": (type: string, data: any) => {
		console.log("sendSync", type, data)
		return ipcRenderer.sendSync(type, data);
	},
	"on": (type: string, callback: Function) => {
		console.log(ipcRenderer);
		ipcRenderer.on(type, (event: any, arg: any): any => {
			console.log(event);
			callback(arg);
		});
	},
});
