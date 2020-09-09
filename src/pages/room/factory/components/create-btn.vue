<template>
  <view class="create-btn-wrap">
    <button
      class="create-btn"
      @tap="openDrawer"
    >
      音
    </button>
    <view class="divider-line" />
    <Drawer
      v-model="state.showDrawer"
      :show-mask="false"
    >
      <view class="search-drawer">
        <Search
          v-model="state.keyword"
          @close="closeDrawer"
        />
      </view>
      <view class="flow-wrap">
        <view
          v-for="item in state.source"
          :key="item.id"
          class="voice-item"
          @tap="handleAddVoice(item)"
        >
          {{ item.reader.nickname }}
        </view>
      </view>
      <view @tap="handleStartRecord">
        增加录音
      </view>
      <view
        v-if="state.voiceTime"
        class="record-wrap"
      >
        <view @tap="handleStopRecord">
          正在录音{{ state.voiceTime }}
        </view>
      </view>
    </Drawer>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { reactive } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'
import source from '../voice.json'

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
      keyword: '',
      source
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
    }

    const openDrawer = () => {
      state.showDrawer = true
    }

    const closeDrawer = () => {
      state.showDrawer = false
    }

    const handleStartRecord = () => {
      if (state.voiceTime) {
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
      })
    }

    const handleStopRecord = () => {
      const recorder = Taro.getRecorderManager()
      recorder.stop()
    }

    return {
      state,
      openDrawer,
      closeDrawer,
      handleAddVoice,
      handleStopRecord,
      handleStartRecord,
    }
  }
}
</script>

<style lang="scss">
.create-btn-wrap {
  .create-btn {
    position: fixed;
    left: 50%;
    bottom: 350px;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 100px;
    border: 1PX solid #e7ecf2;
    background-color: #fff;
    overflow: hidden;
  }

  .divider-line {
    position: fixed;
    left: 50%;
    top: 0;
    width: 0;
    bottom: 0;
    border-right: 1PX dashed #e7ecf2;
  }

  .drawer__wrap {
    .flow-wrap {
      .voice-item {
        display: block;
        padding: 20px;
      }
    }
  }
}
</style>
