<template>
  <view class="audio-item">
    audio
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

    const onPlay = () => {
      if (audio.paused) {
        audio.play()
      }
    }

    const onPause = () => {
      if (audio.paused) {
        return
      }
      audio.pause()
    }

    return {
      onPlay,
      onPause
    }
  }
}
</script>

<style lang="scss">
</style>
