<template>
	<div>
		<template v-if="logged">
			<p>Logged on!</p>
			<p>Your ETH balance is currently {{ this.ipc.sendSync('web3', { 'query': 'balance' }) }}</p>
		</template>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	data () {
		return {
		}
	},
	props: ['logged'],
	mounted() {
		if (this.logged)
			this.ipc.send('web3', { query: 'sign', data: 'toto' });
	},
});
</script>

<style>
.example {
	color: red;
}
</style>
