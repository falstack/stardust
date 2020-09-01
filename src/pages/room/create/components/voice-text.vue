<template>
  <view class="voice-text">
    <textarea
      :value="value"
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
      value: store.getters['live/currentVoice'].text,
      handleChange
    }
  }
}
</script>

<style lang="scss">
</style>
