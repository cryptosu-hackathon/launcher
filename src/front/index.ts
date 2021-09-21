const Vue = require('vue');
const VueRouter = require('vue-router')
import MyComponent from './test.vue'
import QrCodeView from './qrcode.vue'

const routes = [
	{ path: '/', component: MyComponent },
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
		})
		window.ipc.send('qr-code');
	},
}).use(router);

app.mount('#app');
