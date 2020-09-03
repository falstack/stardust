<template>
  <view class="room-live">
    <view class="flex-1">
      <MsgRoom ref="roomRef" />
    </view>
    <view class="flex-shrink-0">
      <view class="buttons">
        <button @tap="startRecord">
          开始录音
        </button>
        <button @tap="stopRecord">
          结束录音
        </button>
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

export default {
  name: 'RoomLive',
  components: {
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

    const messages = computed(() => {
      const content = store.state.live.content
      const result = []

      content.forEach(track => {
        const item = {
          type: 'bubble-msg'
        }
        if (track.type !== 'bgm') {
          item.float = track.type

          track.value.forEach(voice => {
            result.push({
              ...item,
              id: voice.id,
              begin_at: voice.begin_at,
              color_bubble: voice.color_bubble,
              color_text: voice.color_text,
              reader: voice.reader,
              author_id: voice.author_id,
              content: [
                {
                  type: 'mp3',
                  url: voice.url,
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

    onMounted(() => {
      state.startTime = Date.now()
      messageReader()
    })

    onBeforeUnmount(() => {
      clearInterval(state.loopTimer)
    })

    return {
      roomRef,
      stopRecord,
      startRecord,
      addMessage
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

    button {
      flex: 1;
    }
  }
}
</style>
