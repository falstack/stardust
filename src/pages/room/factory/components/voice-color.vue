<template>
  <view
    v-if="voice"
    class="voice-edit-bar voice-color"
  >
    <view
      v-for="(item, index) in colorEnum"
      :key="index"
      :style="{ backgroundColor: item.bg, color: item.text }"
      :class="{ 'is-active': color.bg === item.bg && color.text === item.text }"
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
import { colors } from '~/utils'

export default {
  setup() {
    const store = useStore()
    const colorEnum = computed(() => {
      return colors
    })

    const voice = computed(() => {
      return store.getters['live/currentVoice']
    })

    const color = computed(() => {
      return store.getters['live/readerColor'](voice.value.reader_id)
    })

    const handleClick = (color) => {
      store.commit('live/UPDATE_VOICE_COLOR', {
        color,
        reader: voice.value.reader
      })
    }

    return {
      color,
      voice,
      colorEnum,
      handleClick
    }
  }
}
</script>

<style lang="scss">
.voice-color {
  position: fixed;
  left: 50px;
  bottom: 180px;
  right: 50px;
  height: 80px;
  border-radius: 40px;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  padding-left: 5px;
  padding-right: 5px;

  .color-item {
    display: inline-block;
    width: 81px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    outline: 20px solid transparent;
    margin: 15px;
    border-radius: 10px;
    font-size: 24px;

    &.is-active {
      outline-color: #f6f6f6;
    }
  }
}
</style>
