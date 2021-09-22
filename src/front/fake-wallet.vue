<template>
	<div id="fakewallet">Address: {{ wallet?.connector?.accounts?.[0] }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	props: ["uri", "wallet"],
	methods: {
		init() {
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
}
</style>