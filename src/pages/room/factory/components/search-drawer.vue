<template>
  <Drawer v-model="state.showDrawer">
    <view class="search-drawer">
      <view class="drawer-header">
        <Search
          v-model="state.keyword"
          @close="toggleDrawer"
        />
      </view>
      <view class="flow-wrap">
        <button
          v-for="item in source"
          :key="item.id"
          class="search-item"
          @tap="handleAddVoice(item)"
        >
          <image class="avatar" :src="$utils.resize(item.reader.avatar, 30)" />
          <text class="text">{{ item.text }}</text>
        </button>
      </view>
      <button
        class="record-btn"
        :class="{ 'is-active': state.voiceTime }"
        @tap="handleStartRecord"
      >
        <view class="core" />
      </button>
      <view
        v-if="state.voiceTime"
        class="record-tip"
      >
        <view>
          正在录音：{{ state.voiceTime }}s
        </view>
      </view>
    </view>
  </Drawer>
</template>

<script>
import Taro from '@tarojs/taro'
import { reactive, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'

export default {
  components: {
    Drawer,
    Search
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false,
      voiceTime: 0,
      keyword: ''
    })

    watch(
      () => store.state.live.editor.showSearchDrawer,
      val => {
        state.showDrawer = val
      }
    )

    const source = computed(() => {
      return store.state.live.voices
    })

    const handleAddVoice = (item) => {
      const color = store.getters['live/readerColor'](item.reader.id)
      const data = {
        ...item,
        margin_left: 0,
        begin_at: 0,
        start_at: 0,
        ended_at: 0,
        volume: 100,
        reader: {
          ...item.reader,
          color
        },
        author_id: store.state.userInfo ? store.state.userInfo.id : 0
      }

      store.commit('live/ADD_VOICE_ITEM', data)
      store.commit('live/CHANGE_VOICE_EDIT_TYPE', 'move')
    }

    const toggleDrawer = () => {
      store.commit('live/TOGGLE_SEARCH_DRAWER')
    }

    const handleStartRecord = () => {
      if (state.voiceTime) {
        const recorder = Taro.getRecorderManager()
        recorder.stop()
        return
      }

      const recorder = Taro.getRecorderManager()
      recorder.start({
        duration: 60000,
        format: 'mp3'
      })

      const timer = setInterval(() => {
        state.voiceTime++
      }, 1000)

      recorder.onStop((res) => {
        clearInterval(timer)
        state.voiceTime = 0
        const userId = 1
        const color = store.getters['live/readerColor'](userId)

        const data = {
          source_id: Date.now(),
          url: res.tempFilePath,
          duration: res.duration,
          text: '...',
          margin_left: 0,
          begin_at: 0,
          start_at: 0,
          ended_at: 0,
          volume: 100,
          reader: {
            id: userId,
            avatar: 'https://m1.calibur.tv/cc-19f/1562950958417-r9m.jpeg',
            nickname: '冰淤',
            color
          },
          author_id: store.state.userInfo ? store.state.userInfo.id : 0
        }

        store.commit('live/ADD_VOICE_ITEM', data)
        store.commit('live/CHANGE_VOICE_EDIT_TYPE', 'text')
        store.commit('live/TOGGLE_SEARCH_DRAWER')
      })
    }

    onMounted(() => {
      store.dispatch('live/getVoices')
    })

    return {
      state,
      source,
      toggleDrawer,
      handleAddVoice,
      handleStartRecord
    }
  }
}
</script>

<style lang="scss">
.search-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .drawer-header {
    width: 100%;
    flex-shrink: 0;
  }

  .flow-wrap {
    overflow-y: auto;
    width: 100%;
    flex: 1;

    .search-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border-radius: 0;
      padding: $container-padding;
      border-bottom: 1PX solid #e7ecf2;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: $container-padding;
        flex-shrink: 0;
      }

      .text {
        flex: 1;
        text-align: left;
        @extend %oneline;
      }
    }
  }

  .record-btn {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin: 50px auto;
    background-color: #F4F4F4;
    border: 1PX solid #3D3D3D;

    .core {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border-radius: 50%;
      background-color: #3D3D3D;
    }

    &.is-active {
      .core {
        background-color: red;
      }
    }
  }

  .record-tip {
    text-align: center;
    font-size: 24px;
  }
}
</style>
