const Vue = require('vue');
const VueRouter = require('vue-router')
import Home from './home.vue'
import QrCodeView from './qrcode.vue'

const routes = [
	{ path: '/', name: 'home', component: Home },
	{ path: '/qrcode', name: 'qrcode', component: QrCodeView, props: true },
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
});

const app = Vue.createApp({
	created() {
	},
	mounted () {
		this.$router.replace('/');
		window.ipc.on('qr-code', (arg: any) => {
			this.$router.push({ name: 'qrcode', params: { code: arg }});
		});
		window.ipc.on('logged-on', (arg: any) => {
			this.$router.push({ name: 'home', params: { logged: arg }});
		});
	},
}).use(router);

app.mount('#app');
