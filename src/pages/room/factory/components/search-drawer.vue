<template>
  <view class="search-drawer">
    <Drawer v-model="state.showDrawer" size="calc(100% - 120rpx)">
      <view class="flex-wrap">
        <view class="flex-shrink-0 switcher-wrap">
          <button
            :class="{ 'is-active': state.activeIndex === 0 }"
            class="btn"
            @tap="switchTab(0)"
          >
            公开声源
          </button>
          <button
            :class="{ 'is-active': state.activeIndex === 1 }"
            class="btn"
            @tap="switchTab(1)"
          >
            我的声源
          </button>
        </view>
        <view class="flex-shrink-0">
          <Search
            v-model="state.keyword"
            :show-cancel="false"
            placeholder="根据名称或文字过滤"
            @close="toggleDrawer"
          />
        </view>
        <template v-if="state.activeIndex === 0">
          <view class="flex-1">
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
        </template>
        <template v-else>
          <view class="flex-1">
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
          <view class="flex-shrink-0">
            <button
              class="record-btn primary-btn"
              :class="{ 'is-active': state.voiceTime }"
              @tap="handleStartRecord"
            >
              <text class="iconfont ic-record" />
              <text v-if="state.voiceTime">
                录音中：{{ state.voiceTime }}s
              </text>
              <text v-else>
                点击录音
              </text>
            </button>
            <view class="iphone-bottom-shim" />
          </view>
        </template>
      </view>
    </Drawer>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { reactive, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'
import toast from '~/utils/toast'
import cache from '~/utils/cache'

let duration = 0

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
      activeIndex: 0
    })

    watch(
      () => store.state.live.editor.showSearchDrawer,
      val => {
        state.showDrawer = val
      }
    )

    const source = computed(() => {
      const list = store.state.live.voices[state.activeIndex]
      if (!state.keyword) {
        return list
      }

      return list.filter(_ => `${_.alias},${_.text}`.includes(state.keyword))
    })

    const currentUser = computed(() => store.state.userInfo)

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
        author_id: currentUser.value.id
      }

      store.commit('live/ADD_VOICE_ITEM', data)
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

      recorder.onStart(() => {
        duration = Date.now()
      })

      recorder.onStop((res) => {
        duration = Date.now() - duration
        clearInterval(timer)
        state.voiceTime = 0
        const color = store.getters['live/readerColor'](currentUser.value.id)

        Taro.uploadFile({
          url: 'https://api.calibur.tv/v1/live_room/voice/create',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            Authorization: `Bearer ${cache.get('JWT_TOKEN')}`
          },
          formData: {
            duration
          },
          timeout: 10000,
          success: resp => {
            const resData = JSON.parse(resp.data)
            if (resData.code) {
              toast.info('录音失败了~')
              return
            }
            const audio = resData.data
            const data = {
              source_id: audio.id,
              src: audio.src,
              duration,
              text: '',
              margin_left: 0,
              begin_at: 0,
              start_at: 0,
              ended_at: 0,
              volume: 100,
              reader: {
                id: currentUser.value.id,
                avatar: currentUser.value.avatar,
                nickname: currentUser.value.nickname,
                color
              },
              author_id: currentUser.value.id
            }

            store.commit('live/ADD_VOICE_ITEM', data)
          },
          fail: () => {
            toast.info('录音失败了~')
          }
        })
      })

      recorder.onError(() => {
        toast.info('录音出错了')
      })
    }

    const switchTab = (index) => {
      state.activeIndex = index
      if (index === 1) {
        store.dispatch('live/getVoices', {
          type: '1',
          slug: currentUser.value.slug
        })
      }
    }

    onMounted(() => {
      store.dispatch('live/getVoices', {
        type: '0',
        slug: ''
      })
    })

    return {
      state,
      source,
      switchTab,
      toggleDrawer,
      handleAddVoice,
      handleStartRecord
    }
  }
}
</script>

<style lang="scss">
.search-drawer {
  .drawer__wrap {
    border-radius: 20px 20px 0 0;
  }

  .flex-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;

    .flex-shrink-0 {
      width: 100%;
      flex-shrink: 0;
    }

    .switcher-wrap {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 290px;
      margin: 14px auto 0;
      background-color: #dedede;
      border-radius: 10px;
      padding: 5px 0;

      .btn {
        width: 140px;
        padding: 10px;
        margin: 0;
        height: 50px;
        line-height: 30px;
        font-size: 26px;

        &.is-active {
          background-color: #fff;
        }
      }
    }

    .flex-1 {
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
      margin: $container-padding;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      &.is-active {
        background-color: red;
        border-color: red;
      }
    }

    .record-tip {
      text-align: center;
      font-size: 24px;
    }
  }
}
</style>
