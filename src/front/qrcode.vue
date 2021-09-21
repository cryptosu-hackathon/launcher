<template>
  <div>QRCode:<p class="qrcode" v-html="code"></p></div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
    }
  },
  props: ['code']
});
</script>

<style>
.qrcode
{
	width: 300px;
	display:block;
}
</style>
