<template>
  <view
    v-if="voice"
    class="voice-color"
  >
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
import { colors } from './utils'

export default {
  setup() {
    const store = useStore()
    const colorEnum = computed(() => {
      return colors
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
