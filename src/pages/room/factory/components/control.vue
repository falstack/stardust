<template>
  <view
    v-if="state.canRender"
    class="control"
  >
    <template v-if="hasSelectedVoice">
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
    </template>
    <template v-else>
      <view class="draft-bar">
        <button @tap="openDraftDrawer">
          草稿箱
        </button>
      </view>
      <Drawer v-model="state.showDraftDrawer">
        <view class="draft-drawer">
          <view
            v-if="!drafts.length"
            class="nothing"
          >
            还没有创建草稿
          </view>
          <button
            v-for="item in drafts"
            :key="item.id"
            class="draft-item"
            @tap="switchDraft(item)"
          >
            <view class="title">
              {{ item.title }}
            </view>
            <view class="desc">
              {{ item.desc || '暂无简介' }}
            </view>
            <view class="updated_at">
              {{ $utils.timeAgo(item.updated_at) }}
            </view>
          </button>
        </view>
      </Drawer>
    </template>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, reactive, nextTick } from 'vue'
import Drawer from '~/components/drawer'
import VoiceClip from './voice-clip'
import VoiceColor from './voice-color'
import VoiceDelete from './voice-delete'
import VoiceMove from './voice-move'
import VoiceText from './voice-text'
import VoiceVolume from './voice-volume'
import VoicePlay from './voice-play'
import toast from '~/utils/toast'

export default {
  name: '',
  components: {
    Drawer,
    VoicePlay,
    VoiceClip,
    VoiceColor,
    VoiceDelete,
    VoiceMove,
    VoiceText,
    VoiceVolume
  },
  setup() {
    const store = useStore()
    const state = reactive({
      canRender: true,
      showDraftDrawer: false
    })

    const voiceEditBar = computed(() => {
      return [
        {
          text: '播放',
          type: 'play'
        },
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

    const drafts = computed(() => {
      return store.state.list.userLiveDraft
    })

    const hasSelectedVoice = computed(() => {
      return store.getters['live/currentVoice']
    })

    watch([
      () => store.state.live.editor.focusVoiceId,
      () => store.state.live.editor.focusTrackId
    ], async () => {
      state.canRender = false
      await nextTick()
      state.canRender = true
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

    const openDraftDrawer = () => {
      state.showDraftDrawer = true
      store.dispatch('list/getUserLiveDraft')
    }

    const switchDraft = (item) => {
      store.dispatch('live/loadData', item)
        .then(() => {
          state.showDraftDrawer = false
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    return {
      state,
      hasSelectedVoice,
      handleDelTrack,
      handleAddTrack,
      handleAddVoice,
      handleEditType,
      voiceEditBar,
      selectedVoiceType,
      openDraftDrawer,
      drafts,
      switchDraft
    }
  }
}
</script>

<style lang="scss">
.control {
  .voice-edit-bar {
    background-color: rgba(#fff, 0.5);
    box-shadow: 0 4px 14px rgba(0,0,0,.15);
  }

  .selection-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    overflow-x: auto;

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

  .draft-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 100%;

    button {
      padding-left: $container-padding / 2;
      padding-right: $container-padding / 2;
    }
  }

  .draft-drawer {
    height: 100%;
    overflow-y: auto;

    .nothing {
      font-size: 30px;
      text-align: center;
      padding: $container-padding;
    }

    .draft-item {
      padding: $container-padding;
      border-bottom: 1PX solid #e7ecf2;
      border-radius: 0;
      text-align: left;
      line-height: 1.4;

      .title {
        font-size: 32px;
        font-weight: bold;
      }

      .desc {
        font-size: 28px;
        padding: $container-padding 0;
      }

      .updated_at {
        font-size: 28px;
      }
    }
  }
}
</style>
