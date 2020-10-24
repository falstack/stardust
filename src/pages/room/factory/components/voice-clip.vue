<template>
  <view
    v-if="voice"
    class="voice-edit-bar voice-clip"
  >
    <movable-area class="subway">
      <movable-view
        :x="startX"
        direction="horizontal"
        animation=""
        class="radio"
        @change="handleChange($event, true)"
      />
      <movable-view
        :x="endedX"
        direction="horizontal"
        animation=""
        class="radio"
        @change="handleChange($event, false)"
      />
    </movable-area>
  </view>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: '',
  setup() {
    const store = useStore()
    const voice = computed(() => {
      return store.getters['live/currentVoice']
    })

    const startX = computed(() => {
      return voice.value.start_at
        ? voice.value.start_at / voice.value.duration * 250
        : 0
    })

    const endedX = computed(() => {
      return voice.value.ended_at
        ? voice.value.ended_at / voice.value.duration * 250
        : 250
    })

    let noCross = true
    const handleChange = (evt, isStart) => {
      const reallyStart = noCross && isStart
      const { ended_at, start_at, duration } = voice.value
      const newVal = evt.detail.x / 250 * duration | 0
      let commit
      if (reallyStart) {
        if (ended_at && newVal > ended_at) {
          commit = {
            ended_at: newVal
          }
          noCross = !noCross
        } else {
          commit = {
            start_at: newVal
          }
        }
      } else {
        if (newVal < start_at) {
          commit = {
            start_at: newVal
          }
          noCross = !noCross
        } else {
          commit = {
            ended_at: newVal
          }
        }
      }
      store.commit('live/CLIP_VOICE_DURATION', commit)
    }

    return {
      voice,
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
