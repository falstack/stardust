<template>
  <view class="search-drawer">
    <Drawer
      v-model="state.showDrawer"
      size="calc(100% - 120rpx)"
    >
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
            自制声源
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
              <image
                class="avatar"
                :src="$utils.resize(item.reader.avatar, { width: 80 })"
              />
              <view class="body">
                <text class="text">
                  {{ item.text }}
                </text>
                <view class="meta">
                  <text>时长：{{ (item.duration / 1000).toFixed(1) }}s</text>
                </view>
              </view>
            </button>
          </view>
        </template>
        <template v-else>
          <view class="flex-1">
            <button
              v-for="(item, index) in source"
              :key="item.id"
              class="search-item"
              @tap="handleAddVoice(item)"
            >
              <view class="body">
                <text class="text">
                  {{ item.text || '请输入文字' }}
                </text>
                <view class="meta">
                  <text>时长：{{ (item.duration / 1000).toFixed(1) }}s</text>
                </view>
              </view>
              <view
                class="iconfont ic-edit"
                @tap.stop="handleEditAudio(item, index)"
              />
              <view
                class="iconfont ic-delete"
                @tap.stop="handleDeleteAudio(item, index)"
              />
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
    <Dialog v-model="state.showDialog">
      <view class="edit-audio-dialog">
        <textarea
          v-model="state.updateAudioText"
          type="text"
          placeholder="请输入内容"
          autoFocus="true"
          showConfirmBar=""
          adjustPosition="true"
          class="textarea"
          maxlength="500"
        />
        <view class="footer">
          <button
            class="cancel"
            @tap="handleCloseDialog"
          >
            取消
          </button>
          <button
            class="submit"
            @tap="submitUpdateAudioText"
          >
            确定
          </button>
        </view>
      </view>
    </Dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { reactive, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Search from '~/components/search'
import Drawer from '~/components/drawer'
import Dialog from '~/components/dialog'
import http from '~/utils/http'
import toast from '~/utils/toast'
import cache from '~/utils/cache'

let duration = 0

export default {
  components: {
    Drawer,
    Dialog,
    Search
  },
  setup() {
    const store = useStore()
    const state = reactive({
      showDrawer: false,
      showDialog: false,
      voiceTime: 0,
      keyword: '',
      activeIndex: 0,
      updateAudioText: '',
      updateAudioIndex: -1,
      fetchedMyVoice: false,
      submittingUpdateText: false
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
      const data = {
        id: item.id,
        local_id: `${item.id}-${Date.now()}`,
        src: item.src,
        text: item.text,
        duration: item.duration,
        margin_left: 0,
        begin_at: 0,
        start_at: 0,
        ended_at: 0,
        volume: 100,
        reader_id: item.reader.id,
        author_id: currentUser.value.id
      }

      store.commit('live/ADD_VOICE_ITEM', { data, user: item.reader })
    }

    const handleEditAudio = (item, index) => {
      if (state.updateAudioIndex !== index) {
        state.updateAudioText = item.text
        state.updateAudioIndex = index
      }
      state.showDialog = true
    }

    const handleDeleteAudio = (item) => {
      Taro.showModal({
        title: '确认要删除吗?',
        content: '删除后不影响已公开内容',
        cancelText: '取消',
        confirmText: '删除',
        confirmColor: '#FB7299'
      })
        .then(res => {
          if (res.cancel) {
            return
          }
          http.post('live_room/voice/delete', {
            id: item.id
          })
            .then(() => {
              store.commit('live/DELETE_SELF_VOICE', item)
              toast.info('已删除')
            })
            .catch(() => {
              toast.info('操作失败')
            })
        })
    }

    const toggleDrawer = () => {
      store.commit('live/TOGGLE_SEARCH_DRAWER')
    }

    const beginRecord = () => {
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
        clearInterval(timer)
        state.voiceTime = 0

        Taro.uploadFile({
          url: 'https://api.calibur.tv/v1/live_room/voice/create',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            Authorization: `Bearer ${cache.get('JWT_TOKEN')}`
          },
          formData: {
            duration: Date.now() - duration
          },
          timeout: 10000,
          success: resp => {
            const resData = JSON.parse(resp.data)
            if (resData.code) {
              toast.info('录音失败了~')
              return
            }
            store.commit('live/ADD_SELF_VOICE', resData.data)
          },
          fail: (err) => {
            Taro.showModal({
              title: 'error',
              content: JSON.stringify(err)
            })
            toast.info('录音失败了!')
          }
        })
      })

      recorder.onError(() => {
        toast.info('录音出错了.')
      })
    }

    const handleStartRecord = () => {
      Taro.getSetting({
        success(res) {
          if (!res.authSetting['scope.record']) {
            Taro.authorize({
              scope: 'scope.record',
              success: () => {
                beginRecord()
              },
              fail: () => {
                toast.info('请先授权~')
              }
            })
            return
          }

          beginRecord()
        }
      })
    }

    const switchTab = (index) => {
      state.activeIndex = index
      if (index === 1 && !state.fetchedMyVoice) {
        store.dispatch('live/getVoices', {
          type: '1',
          slug: currentUser.value.slug
        })
        state.fetchedMyVoice = true
      }
    }

    const submitUpdateAudioText = () => {
      const currentAudio = source.value[state.updateAudioIndex]
      if (!currentAudio) {
        return
      }

      if (state.updateAudioText === currentAudio.text) {
        state.showDialog = false
        return
      }

      if (state.submittingUpdateText) {
        return
      }

      state.submittingUpdateText = true
      const params = {
        id: currentAudio.id,
        text: state.updateAudioText
      }
      http.post('live_room/voice/update', params)
        .then(() => {
          state.showDialog = false
          state.updateAudioIndex = -1
          store.commit('live/UPDATE_SELF_VOICE', params)
          state.submittingUpdateText = false
        })
        .catch(() => {
          toast.info('更新失败了')
          state.submittingUpdateText = false
        })
    }

    const handleCloseDialog = () => {
      state.showDialog = false
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
      handleEditAudio,
      handleDeleteAudio,
      handleCloseDialog,
      handleStartRecord,
      submitUpdateAudioText
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
        align-items: flex-start;
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

        .body {
          flex: 1;
          text-align: left;
          line-height: 35px;
        }

        .iconfont {
          width: 60px;
          height: 60px;
          line-height: 60px;
          text-align: center;
        }

        .text {
          display: block;
          margin-bottom: 10px;
          @include mutiline(35px)
        }

        .meta {
          color: $color-text-gray;
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

  .edit-audio-dialog {
    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-top: 1PX solid #e7ecf2;
      padding-top: $container-padding;

      button {
        flex: 1;
      }

      .cancel {
        border-right: 1PX solid #e7ecf2;
      }

      .submit {
        color: #ff6881;
      }
    }
  }
}
</style>
