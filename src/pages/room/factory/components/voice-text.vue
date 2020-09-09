<template>
  <Dialog
    v-if="voice"
    v-model="showDialog"
    :show-mask="false"
    class="voice-text"
  >
    <textarea
      :value="voice.text"
      showConfirmBar=""
      maxlength="200"
      @input="handleChange"
    />
  </Dialog>
</template>

<script>
import Dialog from '~/components/dialog'
import { useStore } from 'vuex'
import { ref } from 'vue'

export default {
  components: {
    Dialog
  },
  setup() {
    const store = useStore()
    const showDialog = ref(true)

    const handleChange = (evt) => {
      store.commit('live/UPDATE_VOICE_TEXT', evt.detail)
    }

    return {
      voice: store.getters['live/currentVoice'],
      showDialog,
      handleChange
    }
  }
}
</script>

<style lang="scss">
</style>
