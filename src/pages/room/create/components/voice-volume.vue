<template>
  <view class="voice-volume">
    <Slider
      show-value="true"
      :value="currentValue"
      @change="handleChange"
    />
  </view>
</template>

<script>
import { Slider } from '@tarojs/components'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: '',
  components: {
    Slider
  },
  setup() {
    const store = useStore()

    const handleChange = (evt) => {
      store.commit('live/UPDATE_VOICE_VOLUME', {
        volume: +parseFloat(evt.detail.value).toFixed(2)
      })
    }

    const currentValue = computed(() => {
      const voice = store.getters['live/currentVoice']
      if (!voice) {
        return 100
      }
      return voice.volume
    })

    return {
      handleChange,
      currentValue
    }
  }
}
</script>

<style lang="scss">
</style>
