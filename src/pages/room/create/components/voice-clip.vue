<template>
  <view class="voice-clip">
    <MovableArea class="subway">
      <MovableView
        :x="startX"
        direction="horizontal"
        animation=""
        class="radio"
        @change="handleChange($event, true)"
      />
      <MovableView
        :x="endedX"
        direction="horizontal"
        animation=""
        class="radio"
        @change="handleChange($event, false)"
      />
    </MovableArea>
  </view>
</template>

<script>
import { MovableArea, MovableView } from '@tarojs/components'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { throttle } from '~/utils'

export default {
  name: '',
  components: {
    MovableArea,
    MovableView
  },
  setup() {
    const store = useStore()

    const voice = computed(() => {
      return store.getters['live/currentVoice']
    })

    const startX = voice.value.start_at
      ? voice.value.start_at / voice.value.duration * 250
      : 0

    const endedX = voice.value.ended_at
      ? voice.value.ended_at / voice.value.duration * 250
      : 250

    let isRight = true
    const handleChange = throttle((evt, isStart) => {
      const reallyStart = isRight && isStart
      const { ended_at, start_at, duration } = voice.value
      const newVal = evt.detail.x / 250 * duration | 0
      let commit
      if (reallyStart && newVal > ended_at) {
        commit = {
          ended_at: newVal
        }
        isRight = !isRight
      } else if (reallyStart && newVal <= ended_at) {
        commit = {
          start_at: newVal
        }
      } else if (!reallyStart && newVal < start_at) {
        commit = {
          start_at: newVal
        }
        isRight = !isRight
      } else {
        commit = {
          ended_at: newVal
        }
      }
      store.commit('live/CLIP_VOICE_DURATION', commit)
    }, 100)

    return {
      handleChange,
      startX,
      endedX
    }
  }
}
</script>

<style lang="scss">
.subway {
  height: 80px;
  background-color: red;
  width: 667px;

  .radio {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #fff;
    color: #000;
  }
}
</style>
