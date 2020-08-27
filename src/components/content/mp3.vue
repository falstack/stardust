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

    audio.play()
  }
}
</script>

<style lang="scss">
</style>
