<template>
	<router-view :key="$route.path"></router-view>
	<fake-wallet :wallet="this.fakeWallet"></fake-wallet>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
const Vue = require('vue');
import FakeWallet from '../fake-wallet/fake-wallet'
import FakeWalletView from './fake-wallet.vue'

var fakeWallet = Vue.reactive(new FakeWallet());

export default defineComponent({
	data() {
		return { fakeWallet }
	},
	created() {
	},
	mounted () {
		this.$router.replace('/');
		window.ipc.on('qr-code', (arg: any) => {
			this.$router.push({ name: 'qrcode', params: { uri: arg.uri, code: arg.svg }});
		});
		window.ipc.on('logged-on', (arg: any) => {
			console.log(arg);
			this.$router.push({ name: 'home', params: { logged: arg }});
		});
	},
	provide() {
		return {
			fakeWallet: this.fakeWallet,
		};
	},
	components: {
		"fake-wallet": FakeWalletView
	}
});
</script>

<style type="text/css">
#fakewallet
{
	float:right;
	width:200px;
	height:200px;
	background:#ddd;
}
</style>