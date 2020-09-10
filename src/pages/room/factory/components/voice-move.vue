<template>
  <view class="voice-edit-bar voice-move">
    <view class="aside">
      <button @tap="changeTrack(true)">
        ←
      </button>
    </view>
    <view class="main">
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
    <view class="aside">
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
  bottom: 180px;
  transform: translateX(-50%);
  width: 200px;
  height: 324px;
  border-radius: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .aside {
    flex: 1;
    height: 160px;

    button {
      width: 100%;
      height: 100%;
      line-height: 160px;
    }
  }

  .main {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    button {
      flex: 1;
      line-height: 81px;
    }
  }
}
</style>
