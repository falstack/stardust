<template>
  <view
    class="live-track"
    :class="[
      { 'is-active': isFocused },
      `live-track__${item.type}`,
      `part-${item.part}`,
    ]"
  >
    <Voice
      v-for="voice in item.value"
      :key="voice.id"
      :item="voice"
      :float="item.type"
    />
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

    return {
      isFocused,
      switchTrack
    }
  }
}
</script>

<style lang="scss">
$track-height: 80px;

.live-track {
  position: absolute;
  width: 12.5%;
  min-height: 100%;
  padding: $container-padding;
  top: 0;

  &__left {
    &.part-1 {
      left: 0;
    }

    &.part-2 {
      left: 12.5%;
    }

    &.part-3 {
      left: 25%;
    }

    &.part-4 {
      left: 37.5%;
    }
  }

  &__right {
    &.part-1 {
      left: 50%
    }

    &.part-2 {
      left: 62.5%
    }

    &.part-3 {
      left: 75%
    }

    &.part-4 {
      left: 87.5%
    }
  }
}
</style>
