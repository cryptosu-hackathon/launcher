<template>
	<div>QRCode:<p class="qrcode" v-html="code"></p></div>
	<button @click="enableFakeWallet">Enable fake wallet</button>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	data () {
		return {
		}
	},
	props: ['uri', 'code'],
	methods: {
		enableFakeWallet() {
			console.log("true");
			this.fakeWallet.initWalletConnect(this.uri);
		}
	},
	inject: ["fakeWallet"]
});
</script>

<style>
.qrcode
{
	width: 300px;
	display:block;
}
</style>
