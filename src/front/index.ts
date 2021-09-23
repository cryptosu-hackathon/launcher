const Vue = require('vue');
const VueRouter = require('vue-router')
import AppComp from './app.vue'
import Home from './home.vue'
import QrCodeView from './qrcode.vue'

const routes = [
	{ path: '/', name: 'home', component: Home, props: true },
	{ path: '/qrcode', name: 'qrcode', component: QrCodeView, props: true },
];

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
});

const app = Vue.createApp(AppComp).use(router);

app.config.globalProperties.ipc = window.ipc;

app.mount('#app');
