<template>
  <view class="room-live">
    <MsgRoom ref="roomRef" />
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
  setup(props, ctx) {
    const roomRef = ref(null)
    const addMessage = () => {
      roomRef.value.addMessage({
        data: {
          id: 1,
          content: [
            '123'
          ],
          user: {
            id: 1,
            avatar: 'avatar',
            nickname: '冰淤'
          }
        }
      })
    }

    return {
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
}
</style>
