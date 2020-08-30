<template>
  <view class="control">
    control
    <view v-if="isTrackMode">
      <view @tap="handleAddTrack">增加轨道</view>
      <view @tap="handleAddVoice">增加声源</view>
      <view @tap="handleDelTrack">删除轨道</view>
    </view>
    <view v-if="isVoiceMode">
      <view>裁剪</view>
      <view>音量</view>
      <view>移动</view>
      <view>变轨</view>
      <view>删除</view>
      <view>颜色</view>
      <view>文案</view>
      <view>音量</view>
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

    const handleDelTrack = () => {
      store.commit('live/DEL_TRACK')
    }

    const handleAddVoice = () => {
      store.commit('live/TOGGLE_VOICE_DRAWER')
    }

    return {
      isTrackMode,
      isVoiceMode,
      handleDelTrack,
      handleAddTrack,
      handleAddVoice
    }
  }
}
</script>

<style lang="scss">
</style>
