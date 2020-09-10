<template>
  <view class="voice-edit-bar voice-volume">
    <Slider
      show-value="true"
      active-color="#3D3D3D"
      block-size="20"
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
.voice-volume {
  position: fixed;
  left: 50px;
  right: 50px;
  bottom: 180px;
  height: 80px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  slider {
    width: 100%;
  }
}
</style>
