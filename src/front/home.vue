<template>
  <div>
  	<h1>CryptOsu! Launcher</h1>
  	<template v-if="logged">
  		<p>Logged on!</p>
  		<p>Your ETH balance is currently {{ window.ipc.send('web3', { 'query': 'balance' }) }}</p>
  	</template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {}
  },
  props: ['logged']
});
</script>

<style>
.example {
  color: red;
}
</style>
