<template>
  <view class="audio-item">
    {{ item.text }}
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const audio = Taro.createInnerAudioContext()
    let canceler
    audio.src = props.item.src
    audio.volume = props.item.volume / 100

    audio.play()

    audio.onPlay(() => {
      canceler = watch(() => store.state.live.playing, (val) => {
        val ? audio.play() : audio.pause()
      })
    })

    audio.onEnded(() => {
      audio.destroy()
      canceler()
    })

    onBeforeUnmount(() => {
      audio.destroy()
      canceler()
    })
  }
}
</script>

<style lang="scss">
</style>
