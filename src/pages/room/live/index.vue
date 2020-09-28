<template>
  <view class="room-live">
    <view class="flex-1">
      <MsgRoom ref="roomRef" />
    </view>
    <view class="flex-shrink-0">
      <PublishBar v-if="isEditMode" />
      <view v-else>
        bottom bar
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
import PublishBar from './components/publish-bar'
import toast from '~/utils/toast'

export default {
  name: 'RoomLive',
  components: {
    PublishBar,
    MsgRoom
  },
  setup() {
    const roomRef = ref(null)
    const state = reactive({
      loopTimer: 0,
      startTime: 0,
      lastIndex: -1
    })
    const store = useStore()
    const params = Taro.getCurrentInstance().router.params

    const messages = computed(() => {
      const content = store.state.live.content
      const readers = store.state.live.readers
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

    const isEditMode = computed(() => {
      return !params.id
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

    const startPlay = () => {
      const runner = () => {
        state.startTime = Date.now()
        messageReader()
      }

      if (!params.id) {
        runner()
        return
      }

      store.dispatch('live/loadData', params)
        .then(() => {
          runner()
        })
        .catch(err => {
          toast.info(err.message)
        })
    }

    onMounted(() => {
      startPlay()
    })

    onBeforeUnmount(() => {
      clearInterval(state.loopTimer)
    })

    return {
      state,
      roomRef,
      isEditMode,
      stopRecord,
      addMessage,
      startRecord
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
