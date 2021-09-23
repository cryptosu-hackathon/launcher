const Vue = require('vue');
const VueRouter = require('vue-router')
import Home from './home.vue'
import QrCodeView from './qrcode.vue'
import FakeWalletView from './fake-wallet.vue'

const routes = [
	{ path: '/', name: 'home', component: Home, props: true },
	{ path: '/qrcode', name: 'qrcode', component: QrCodeView, props: true },
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
});

import FakeWallet from '../fake-wallet/fake-wallet'
var fakeWallet = Vue.reactive(new FakeWallet());


const app = Vue.createApp({
	data() {
		return { fakeWallet }
	},
	created() {
	},
	mounted () {
		this.$router.replace('/');
		window.ipc.on('qr-code', (arg: any) => {
			this.fakeWallet.initWalletConnect(arg.uri);
			this.$router.push({ name: 'qrcode', params: { code: arg.svg }});
		});
		window.ipc.on('logged-on', (arg: any) => {
			console.log(arg);
			this.$router.push({ name: 'home', params: { logged: arg }});
		});
	}
}).use(router).component('fake-wallet', FakeWalletView);

app.config.globalProperties.ipc = window.ipc;

app.mount('#app');
