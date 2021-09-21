<template>
  <div class="example">test : {{ msg }}</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
      msg: 'Hello world!'
    }
  }
});
</script>

<style>
.example {
  color: red;
}
</style>
