<template>
  <view class="voice-edit-bar voice-delete">
    <text>删除声源后不可恢复，确定吗？</text>
    <button @tap="handleDelete">
      删除
    </button>
  </view>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: '',
  setup() {
    const store = useStore()

    const handleDelete = () => {
      store.commit('live/DELETE_VOICE_ITEM')
    }

    return {
      handleDelete
    }
  }
}
</script>

<style lang="scss">
.voice-delete {
  position: fixed;
  left: 50px;
  right: 50px;
  bottom: 180px;
  height: 80px;
  border-radius: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: $container-padding * 2;
  padding-right: $container-padding;

  text {
    font-size: 28px;
  }

  button {
    font-size: 28px;
    color: #ff6881;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
