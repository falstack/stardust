<template>
  <view class="voice-move">
    <button @tap="handleClick(-10)">
      &lt;&lt;
    </button>
    <button @tap="handleClick(-1)">
      &lt;
    </button>
    <button @tap="handleClick(1)">
      &gt;
    </button>
    <button @tap="handleClick(10)">
      &gt;&gt;
    </button>
  </view>
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const handleClick = (value) => {
      store.commit('live/UPDATE_VOICE_MARGIN', { value })
    }

    return {
      handleClick
    }
  }
}
</script>

<style lang="scss">
.voice-move {
  color: #fff;
}
</style>
