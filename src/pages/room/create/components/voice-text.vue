<template>
  <view
    v-if="voice"
    class="voice-text"
  >
    <textarea
      :value="voice.text"
      showConfirmBar=""
      maxlength="200"
      @input="handleChange"
    />
  </view>
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const handleChange = (evt) => {
      store.commit('live/UPDATE_VOICE_TEXT', evt.detail)
    }

    return {
      voice: store.getters['live/currentVoice'],
      handleChange
    }
  }
}
</script>

<style lang="scss">
</style>
