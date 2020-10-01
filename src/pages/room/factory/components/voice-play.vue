<template>
  <button @tap="handleClick">
    <text
      class="iconfont"
      :class="[state.playing ? 'ic-playing' : 'ic-paused']"
    />
  </button>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { reactive, onBeforeUnmount } from 'vue'

export default {
  setup() {
    const store = useStore()
    const state = reactive({
      playing: false
    })
    const audio = Taro.createInnerAudioContext()

    const handleClick = () => {
      if (state.playing) {
        audio.pause()
        state.playing = false
        return
      }

      const voice = store.getters['live/currentVoice']

      if (!voice) {
        return
      }

      audio.src = voice.src
      audio.volume = voice.volume / 100

      audio.play()
      state.playing = true

      audio.onEnded(() => {
        state.playing = false
      })
    }

    onBeforeUnmount(() => {
      audio.destroy()
    })

    return {
      state,
      handleClick
    }
  }
}
</script>

<style lang="scss">
</style>
