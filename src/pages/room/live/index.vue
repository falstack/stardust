<template>
  <view class="room-live">
    <view class="flex-1">
      <MsgRoom ref="roomRef" :list="message" />
    </view>
    <button @tap="addMessage">add+</button>
  </view>
</template>

<script>
import { ref } from 'vue'
import MsgRoom from '~/components/message/room'

export default {
  name: 'RoomLive',
  components: {
    MsgRoom
  },
  setup() {
    const roomRef = ref(null)
    const message = [
      {
        id: 1,
        type: 'bubble-msg',
        side: 'left',
        content: [
          {
            type: 'txt',
            text: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
          }
        ],
        user: {
          id: 1,
          avatar: 'avatar',
          nickname: '冰淤'
        }
      }
    ]

    const addMessage = () => {
      roomRef.value.addMessage({
        id: 1,
        type: 'bubble-msg',
        side: 'left',
        content: [
          {
            type: 'txt',
            text: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
          }
        ],
        user: {
          id: 1,
          avatar: 'avatar',
          nickname: '冰淤'
        }
      })
    }

    return {
      message,
      roomRef,
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
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .flex-1 {
    flex-grow: 1;
    width: 100%;
  }
}
</style>
