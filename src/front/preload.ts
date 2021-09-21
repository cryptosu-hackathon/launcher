const { ipcRenderer } = require('electron');
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipc', {
	"send": (type: string, data: any) => {
		ipcRenderer.send(type, data);
	},
	"on": (type: string, callback: Function) => {
		console.log(ipcRenderer);
		ipcRenderer.on(type, (event: any, arg: any): any => {
			console.log(event);
			callback(arg);
		});
	},
});
