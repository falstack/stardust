<template>
  <view
    class="voice-item"
    :class="[{ 'is-active': isFocused }, `is-${float}`]"
    @tap="handleClick"
  >
    <view
      class="bubble"
      :style="bubbleStyle"
    >
      {{ item.text }}
    </view>
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
    },
    float: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const bubbleStyle = computed(() => {
      const height = (props.item.ended_at || props.item.duration) - props.item.start_at
      const color = store.getters['live/readerColor'](props.item.reader.id)
      return {
        color: color.text,
        height: `${height / 50 | 0}px`,
        marginTop: `${props.item.margin_left * 2}px`,
        backgroundColor: color.bg
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
      bubbleStyle,
      handleClick
    }
  }
}
</script>

<style lang="scss">
.voice-item {
  display: block;
  width: 100%;

  &.is-active {
    .bubble {
      opacity: 1;
    }
  }

  .bubble {
    font-size: 24px;
    padding: 14px;
    border-radius: 8px;
    opacity: 0.5;
    word-break: break-all;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
