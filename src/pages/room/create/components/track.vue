<template>
  <view
    class="live-track"
    :class="{ 'is-active': isFocused }"
  >
    <view class="track-name" @tap="switchTrack">{{ name }}</view>
    <view class="voice-wrap">
      <Voice
        v-for="voice in item.value"
        :key="voice.id"
        :item="voice"
      />
    </view>
  </view>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Voice from './voice'

export default {
  components: {
    Voice
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const switchTrack = () => {
      store.commit('live/UPDATE_FOCUS_TRACK', props.item)
    }

    const isFocused = computed(() => {
      return store.state.live.editor.focusTrackId === props.item.id
    })

    const name = computed(() => {
      const type = props.item.type
      if (type === 'bgm') {
        return 'BGM'
      }
      return type === 'left' ? `左${props.item.part}` : `右${props.item.part}`
    })

    return {
      name,
      isFocused,
      switchTrack
    }
  }
}
</script>

<style lang="scss">
$track-height: 80px;

.live-track {
  position: relative;
  border-bottom: 1PX solid #272822;
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-width: 100%;

  &.is-active {
    .voice-wrap {
      background-color: #3E3D32;
    }
  }

  .track-name {
    position: sticky;
    left: 0;
    top: 0;
    width: $track-height;
    height: $track-height;
    line-height: $track-height;
    font-size: 26px;
    text-align: center;
    background-color: #272822;
    flex-shrink: 0;
  }

  .voice-wrap {
    flex: 1;
    display: inline-block;
    height: $track-height;
    padding: 10px;
    white-space: nowrap;
    background-color: #3C3F41;
  }
}
</style>
