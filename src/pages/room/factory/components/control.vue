<template>
  <view
    v-if="canRender && hasSelectedVoice"
    class="control"
  >
    <component
      :is="`voice-${selectedVoiceType}`"
      v-if="selectedVoiceType"
    />
    <view class="selection-wrap">
      <button
        v-for="item in voiceEditBar"
        :key="item.type"
        :class="{ 'is-active': item.type === selectedVoiceType }"
        class="selection-item"
        @tap="handleEditType(item.type)"
      >
        {{ item.text }}
      </button>
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref, nextTick } from 'vue'
import VoiceClip from './voice-clip'
import VoiceColor from './voice-color'
import VoiceDelete from './voice-delete'
import VoiceMove from './voice-move'
import VoiceText from './voice-text'
import VoiceVolume from './voice-volume'

export default {
  name: '',
  components: {
    VoiceClip,
    VoiceColor,
    VoiceDelete,
    VoiceMove,
    VoiceText,
    VoiceVolume
  },
  setup() {
    const canRender = ref(true)
    const store = useStore()

    const voiceEditBar = computed(() => {
      return [
        // {
        //   text: '裁剪',
        //   type: 'clip'
        // },
        {
          text: '音量',
          type: 'volume'
        },
        {
          text: '变轨',
          type: 'move'
        },
        {
          text: '颜色',
          type: 'color'
        },
        {
          text: '文案',
          type: 'text'
        },
        {
          text: '删除',
          type: 'delete'
        }
      ]
    })

    const hasSelectedVoice = computed(() => {
      return !!store.state.live.editor.focusVoiceId
    })

    watch([
      () => store.state.live.editor.focusVoiceId,
      () => store.state.live.editor.focusTrackId
    ], async () => {
      canRender.value = false
      await nextTick()
      canRender.value = true
    })

    const selectedVoiceType = computed(() => {
      return store.state.live.editor.voiceEditType
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

    const handleEditType = (type) => {
      store.commit('live/CHANGE_VOICE_EDIT_TYPE', type)
    }

    return {
      hasSelectedVoice,
      handleDelTrack,
      handleAddTrack,
      handleAddVoice,
      handleEditType,
      voiceEditBar,
      selectedVoiceType,
      canRender
    }
  }
}
</script>

<style lang="scss">
.selection-wrap {
  display: flex;
  flex-direction: row;

  .selection-item {
    width: 80px;
    height: 60px;
    line-height: 60px;
    flex-shrink: 0;
    margin: 10px;
    font-size: 26px;

    &.is-active {
      color: #ff6881;
      background-color: #F4F4F4;
    }
  }
}
</style>
