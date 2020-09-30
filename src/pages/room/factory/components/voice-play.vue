<template>
  <view class="voice-edit-bar voice-play" />
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { onBeforeUnmount } from 'vue'

export default {
  setup() {
    const store = useStore()
    const voice = store.getters['live/currentVoice']

    if (!voice) {
      return
    }

    const audio = Taro.createInnerAudioContext()
    audio.src = voice.src
    audio.volume = voice.volume / 100

    audio.play()

    audio.onEnded(() => {
      audio.destroy()
    })

    onBeforeUnmount(() => {
      audio.destroy()
    })
  }
}
</script>

<style lang="scss">
</style>
