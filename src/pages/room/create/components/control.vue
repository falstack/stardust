<template>
  <view class="control">
    control
    <view v-if="isTrackMode">
      <view @tap="handleAddTrack">增加轨道</view>
    </view>
    <view v-if="isVoiceMode">
      is voice mode
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: '',
  components: {},
  setup() {
    const store = useStore()

    const isTrackMode = computed(() => {
      return !!store.state.live.editor.focusTrackId
    })

    const isVoiceMode = computed(() => {
      return !!store.state.live.editor.focusVoiceId
    })

    const handleAddTrack = () => {
      store.commit('live/ADD_TRACK')
    }

    return {
      isTrackMode,
      isVoiceMode,
      handleAddTrack
    }
  }
}
</script>

<style lang="scss">
</style>
