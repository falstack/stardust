<template>
  <view class="index">
    <TestInput v-model="msg" />
    <view>msg：{{ msg }}</view>
    <button @tap="add">
      add+
    </button>
  </view>
</template>

<script>
import { ref } from 'vue'
import TestInput from './testInput'

export default {
  components: {
    TestInput
  },
  setup() {
    const msg = ref('hello vue3!')
    const add = () => msg.value += 'a'

    return {
      msg,
      add
    }
  }
}
</script>
