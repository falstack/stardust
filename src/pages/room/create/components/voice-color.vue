<template>
  <view class="voice-color">
    <view
      v-for="(item, index) in colorEnum"
      :key="index"
      :style="{ backgroundColor: item.bg, color: item.text }"
      :class="{ 'is-active': voice.color_bubble === item.bg && voice.color_text === item.text }"
      class="color-item"
      @tap="handleClick(item)"
    >
      文字
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  setup() {
    const store = useStore()
    const colorEnum = computed(() => {
      return [
        { bg: '#ffd43b', text: '#fff' },
        { bg: '#12b7f5', text: '#fff' },
        { bg: '#ff8eb3', text: '#fff' },
        { bg: '#20c997', text: '#fff' },
        { bg: '#adb5bd', text: '#fff' },
        { bg: '#cc5de8', text: '#fff' }
      ]
    })

    const voice = computed(() => {
      return store.getters['live/currentVoice']
    })

    const handleClick = (item) => {
      store.commit('live/UPDATE_VOICE_COLOR', item)
    }

    return {
      voice,
      colorEnum,
      handleClick
    }
  }
}
</script>

<style lang="scss">
.voice-color {
  .color-item {
    display: inline-block;
    width: 150px;
    height: 93px;
    border-radius: 10px;
    text-align: center;
    line-height: 89px;
    border: 2px solid transparent;

    &.is-active {
      border-color: #fff;
    }
  }
}
</style>
