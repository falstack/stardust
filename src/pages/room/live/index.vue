<template>
  <view class="room-live">
    <view class="flex-1">
      <MsgRoom ref="roomRef" />
    </view>
    <view class="flex-shrink-0">
      <button @tap="addMessage">add+</button>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import MsgRoom from '~/components/message/room'
import messages from './message.json'

export default {
  name: 'RoomLive',
  components: {
    MsgRoom
  },
  setup() {
    const roomRef = ref(null)
    const count = ref(0)

    const addMessage = () => {
      roomRef.value.addMessage(messages[count.value++])
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
  }
}
</style>
