<template>
  <view class="control">
    <view v-if="isTrackMode">
      <view @tap="handleAddTrack">增加轨道</view>
      <view @tap="handleAddVoice">增加声源</view>
      <view @tap="handleDelTrack">删除轨道</view>
    </view>
    <view v-if="isVoiceMode">
      <component
        :is="`voice-${selectedVoiceType}`"
        v-if="selectedVoiceType"
      />
      <view class="selection-wrap">
        <view class="selection-shim" />
        <view class="iphone-bottom-shim" />
        <view class="selection-bar">
          <view
            v-for="item in voiceEditBar"
            :key="item.type"
            :class="{ 'is-active': item.type === selectedVoiceType }"
            class="selection-item"
            @tap="handleEditType(item.type)"
          >{{ item.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import VoiceClip from './voice-clip'
import VoiceColor from './voice-color'
import VoiceDelete from './voice-delete'
import VoiceMove from './voice-move'
import VoiceText from './voice-text'
import VoiceTrack from './voice-track'
import VoiceVolume from './voice-volume'

export default {
  name: '',
  components: {
    VoiceClip,
    VoiceColor,
    VoiceDelete,
    VoiceMove,
    VoiceText,
    VoiceTrack,
    VoiceVolume
  },
  setup() {
    const store = useStore()

    const voiceEditBar = computed(() => {
      return [
        {
          text: '裁剪',
          type: 'clip'
        },
        {
          text: '音量',
          type: 'volume'
        },
        {
          text: '移动',
          type: 'move'
        },
        {
          text: '变轨',
          type: 'track'
        },
        {
          text: '删除',
          type: 'delete'
        },
        {
          text: '颜色',
          type: 'color'
        },
        {
          text: '文案',
          type: 'text'
        }
      ]
    })

    const isTrackMode = computed(() => {
      return !!store.state.live.editor.focusTrackId
    })

    const isVoiceMode = computed(() => {
      return !!store.state.live.editor.focusVoiceId
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
      isTrackMode,
      isVoiceMode,
      handleDelTrack,
      handleAddTrack,
      handleAddVoice,
      handleEditType,
      voiceEditBar,
      selectedVoiceType
    }
  }
}
</script>

<style lang="scss">
.selection-wrap {
  .selection-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    white-space: nowrap;
    box-sizing: content-box;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    overflow-x: auto;
    overflow-y: hidden;

    .selection-item {
      display: inline-flex;
      font-size: 24px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .selection-shim,
  .selection-bar {
    width: 100%;
    height: 100px;
  }

  .selection-item {
    width: 100px;
    height: 100px;

    &.is-active {
      background-color: #3E3D32;
      color: red;
    }
  }

  .selection-shim {
    background-color: transparent;
  }
}
</style>
