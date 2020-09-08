<template>
  <view
    class="voice-item"
    :style="voiceStyle"
    :class="{ 'is-active': isFocused }"
    @tap="handleClick"
  >
    <text class="voice-text">
      {{ item.text }}
    </text>
  </view>
</template>

<script>
import { computed } from 'vue'
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
    const voiceStyle = computed(() => {
      const width = (props.item.ended_at || props.item.duration) - props.item.start_at

      return {
        color: props.item.color_text,
        width: `${width / 50 | 0}px`,
        marginLeft: `${props.item.margin_left * 2}px`,
        backgroundColor: props.item.color_bubble
      }
    })

    const isFocused = computed(() => {
      return store.state.live.editor.focusVoiceId === props.item.id
    })

    const handleClick = () => {
      store.commit('live/UPDATE_FOCUS_VOICE', {
        id: props.item.id
      })
    }

    return {
      isFocused,
      voiceStyle,
      handleClick
    }
  }
}
</script>

<style lang="scss">
.voice-item {
  display: inline-flex;
  height: 60px;
  border-radius: 20px;
  padding: 10px;
  line-height: 40px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /*transition: width 100ms;*/

  &.is-active {
    border: 2px solid #fff;
  }

  .voice-text {
    font-size: 20px;
    @extend %oneline;
  }
}
</style>
