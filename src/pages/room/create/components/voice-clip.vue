<template>
  <view class="voice-clip">
    <MovableArea class="subway">
      <MovableView
        :x="startX"
        direction="horizontal"
        class="radio"
        @change="handleChange($event, true)"
      />
      <MovableView
        :x="endedX"
        direction="horizontal"
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

    const handleChange = (evt, isStart) => {
      const newVal = evt.detail.x / 250 * voice.value.duration | 0
      let commit
      if (isStart && newVal > voice.value.ended_at) {
        commit = {
          start_at: voice.value.ended_at,
          ended_at: newVal
        }
      } else if (isStart && newVal <= voice.value.ended_at) {
        commit = {
          start_at: newVal,
          ended_at: voice.value.ended_at
        }
      } else if (!isStart && newVal < voice.value.start_at) {
        commit = {
          start_at: newVal,
          ended_at: voice.value.start_at
        }
      } else {
        commit = {
          start_at: voice.value.start_at,
          ended_at: newVal
        }
      }
      store.commit('live/CLIP_VOICE_DURATION', commit)
      console.log('handleChange', commit)
    }
    console.log(startX, endedX)
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
  }
}
</style>
