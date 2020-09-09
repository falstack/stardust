<template>
  <view class="voice-move">
    <view>
      <button @tap="changeTrack(true)">
        ←
      </button>
    </view>
    <view>
      <button @tap="changeMargin(-1)">
        ↑
      </button>
      <button @tap="changeMargin(-10)">
        ↑↑↑
      </button>
      <button @tap="changeMargin(10)">
        ↓↓↓
      </button>
      <button @tap="changeMargin(1)">
        ↓
      </button>
    </view>
    <view>
      <button @tap="changeTrack(false)">
        →
      </button>
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const changeMargin = (value) => {
      store.commit('live/UPDATE_VOICE_MARGIN', { value })
    }

    const changeTrack = (isUp) => {
      store.commit('live/CHANGE_VOICE_TRACK', { isUp })
    }

    return {
      changeMargin,
      changeTrack
    }
  }
}
</script>

<style lang="scss">
.voice-move {
  position: fixed;
  left: 50%;
  bottom: 150px;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  border-radius: 100px;
  border: 1px solid red;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
