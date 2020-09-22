<template>
  <view class="audio-item">
    {{ item.text }}
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { onBeforeUnmount } from 'vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const audio = Taro.createInnerAudioContext()
    audio.src = props.item.src

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
