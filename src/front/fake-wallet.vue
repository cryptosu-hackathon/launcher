<template>
	<div id="fakewallet">
		<p>Address: {{ wallet?.connector?.accounts?.[0] }}</p>
		<div v-if="wallet.pending">
			<h2>Pending Request</h2>
			<p>Type: {{ wallet.pending?.type || 'unknown' }}</p>
			<button @click="approveRequest">Approve</button>
			<button @click="rejectRequest">Reject</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	props: ["uri", "wallet"],
	methods: {
		init() {
		},
		approveRequest() {
			this.wallet.approvePending();
		},
		rejectRequest() {
			this.wallet.rejectPending();
		}
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
	box-shadow: 2px 1px 5px #ccc;
}
</style>