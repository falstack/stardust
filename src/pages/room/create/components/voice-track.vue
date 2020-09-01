<template>
  <view class="voice-track">
    <button @tap="handleClick(true)">向上</button>
    <button @tap="handleClick(false)">向下</button>
  </view>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: '',
  setup() {
    const store = useStore()

    const handleClick = (isUp) => {
      store.commit('live/CHANGE_VOICE_TRACK', { isUp })
    }

    return {
      handleClick
    }
  }
}
</script>

<style lang="scss">
</style>
