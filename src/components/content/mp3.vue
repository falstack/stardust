<template>
  <view class="audio-item">
    {{ item.text }}
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const audio = Taro.createInnerAudioContext()
    audio.src = props.item.url

    if (props.item.start_at) {
      audio.startTime = props.item.start_at / 1000 | 0
    }

    audio.play()

    if (props.item.end_at) {
      setTimeout(() => {
        audio.pause()
        audio.destroy()
      }, props.item.end_at - (props.item.start_at || 0))
    } else {
      audio.onEnded(() => {
        audio.destroy()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
