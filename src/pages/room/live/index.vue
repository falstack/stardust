<template>
  <view class="room-live">
    <view class="flex-1">
      <MsgRoom ref="roomRef" />
    </view>
    <view class="flex-shrink-0">
      <view class="buttons">
        <button
          class="primary-btn-plain"
          @tap="handlePublish(false)"
        >
          存草稿
        </button>
        <button
          class="primary-btn"
          @tap="openPublishDrawer"
        >
          发布
        </button>
        <Drawer
          v-model="state.publish.showDrawer"
          size="80%"
        >
          <view class="publish-drawer">
            <view class="pub-title">
              标题
            </view>
            <input
              v-model="state.publish.title"
              type="text"
              placeholder="取一个有趣的标题吧"
              adjustPosition=""
              maxlength="20"
              class="input"
            >
            <view class="pub-title">
              简介
            </view>
            <textarea
              v-model="state.publish.desc"
              type="text"
              placeholder="请输入内容简介"
              autoFocus="true"
              showConfirmBar=""
              class="textarea"
              maxlength="200"
            />
            <button
              class="primary-btn"
              @tap="handlePublish(true)"
            >
              发布
            </button>
          </view>
        </Drawer>
      </view>
      <view class="iphone-bottom-shim" />
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import MsgRoom from '~/components/message/room'
import Drawer from '~/components/drawer'
import toast from '~/utils/toast'
import http from '~/utils/http'

export default {
  name: 'RoomLive',
  components: {
    MsgRoom,
    Drawer
  },
  setup() {
    const roomRef = ref(null)
    const state = reactive({
      loopTimer: 0,
      startTime: 0,
      lastIndex: -1,
      publish: {
        showDrawer: false,
        title: '',
        desc: '',
        loading: false
      }
    })
    const store = useStore()

    const messages = computed(() => {
      const content = store.state.live.content
      const readers = store.state.live.editor.readers
      const result = []

      content.forEach(track => {
        const item = {
          type: 'bubble-msg'
        }
        if (track.type === 'bgm') {
          // BGM
        } else {
          item.float = track.type
          track.value.forEach(voice => {
            result.push({
              ...item,
              id: voice.id,
              begin_at: voice.begin_at,
              reader: readers.filter(_ => _.id === voice.reader_id)[0],
              author_id: voice.author_id,
              content: [
                {
                  type: 'mp3',
                  src: voice.src,
                  text: voice.text
                }
              ]
            })
          })
        }
      })

      result.sort((prev, next) => prev.begin_at - next.begin_at)

      return result
    })

    const addMessage = (index) => {
      roomRef.value.addMessage(messages.value[index])
    }

    const messageReader = () => {
      state.loopTimer = setInterval(() => {
        let setValue = 0
        let noAppend = true
        for (let i = state.lastIndex + 1; i < messages.value.length; ++i) {
          if (messages.value[i].begin_at <= Date.now() - state.startTime) {
            addMessage(i)
            setValue = i
            noAppend = false
          } else {
            break
          }
        }
        if (noAppend) {
          return
        }

        if (setValue === messages.value.length - 1) {
          clearInterval(state.loopTimer)
          state.loopTimer = 0
        }
        state.lastIndex = setValue
      }, 160)
    }

    const startRecord = () => {
      const recorder = Taro.getRecorderManager()
      recorder.start({
        duration: 20000,
        format: 'mp3'
      })

      recorder.onStop((res) => {
        const audio = Taro.createInnerAudioContext()
        audio.src = res.tempFilePath
        audio.play()
      })
    }

    const stopRecord = () => {
      const recorder = Taro.getRecorderManager()
      recorder.stop()
    }

    const handlePublish = (isPublish) => {
      if (isPublish) {
        if (!state.publish.title) {
          toast.info('请先输入标题')
          return
        }

        if (!state.publish.desc) {
          toast.info('请先输入简介')
          return
        }
      }

      if (state.publish.loading) {
        return
      }

      state.publish.loading = true
      http.post('live_room/publish', {
        id: store.state.live.editor.draftId,
        content: store.state.live.content,
        readers: store.state.live.editor.readers,
        title: state.publish.title || new Date().toLocaleDateString(),
        desc: state.publish.desc,
        is_publish: isPublish
      })
        .then(liveId => {
          if (isPublish) {
            // redirect To live page
          } else {
            store.commit('live/SET_DRAFT_ID', liveId)
          }
        })
        .catch(err => {
          toast.info(err.message)
        })
        .finally(() => {
          state.publish.loading = false
        })
    }

    const openPublishDrawer = () => {
      state.publish.showDrawer = true
    }

    onMounted(() => {
      state.startTime = Date.now()
      messageReader()
    })

    onBeforeUnmount(() => {
      clearInterval(state.loopTimer)
    })

    return {
      state,
      roomRef,
      stopRecord,
      addMessage,
      startRecord,
      handlePublish,
      openPublishDrawer
    }
  }
}
</script>

<style lang="scss">
.room-live {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;

  .flex-1 {
    flex: 1;
    width: 100%;
    overflow: hidden;
  }

  .flex-shrink-0 {
    width: 100%;
    flex-shrink: 0;
    background-color: #fff;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: $container-padding;

    button {
      flex: 1;

      &:first-child {
        margin-right: $container-padding / 2;
      }

      &:last-child {
        margin-left: $container-padding / 2;
      }
    }
  }

  .publish-drawer {
    padding: $container-padding;
    height: 100%;
    background-color: #fff;

    .pub-title {
      font-size: 30px;
      margin-bottom: $container-padding;
    }

    .input,
    .textarea {
      background-color: #f9f9f9;
      padding: $container-padding;
      border-radius: $container-padding;
      margin-bottom: $container-padding;
      font-size: 28px;
    }

    .input {
      height: $container-padding * 4;
      line-height: $container-padding * 3;
    }
  }
}
</style>
