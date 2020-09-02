<template>
  <view
    v-if="canRender"
    class="control"
  >
    <view @tap="handleAddTrack">
      增加轨道
    </view>
    <view @tap="handleAddVoice">
      增加声源
    </view>
    <view @tap="handleDelTrack">
      删除轨道
    </view>
    <view v-if="hasSelectedVoice">
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
          >
            {{ item.text }}
          </view>
        </view>
      </view>
      <button @tap="handleStartPlay">
        试听
      </button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { computed, watch, ref, nextTick } from 'vue'
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
    const canRender = ref(true)
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

    const voice = computed(() => {
      return store.getters['live/currentVoice']
    })

    const handleStartPlay = () => {
      if (!voice.value) {
        return
      }
      const audio = Taro.createInnerAudioContext()
      audio.src = voice.value.url
      audio.volume = voice.value.volume / 100

      if (voice.value.start_at) {
        audio.startTime = voice.value.start_at / 1000 | 0
      }

      audio.play()

      if (voice.value.ended_at) {
        setTimeout(() => {
          audio.pause()
          audio.destroy()
        }, voice.value.ended_at - voice.value.start_at)
      } else {
        audio.onEnded(() => {
          audio.destroy()
        })
      }
    }

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
      canRender,
      handleStartPlay
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
