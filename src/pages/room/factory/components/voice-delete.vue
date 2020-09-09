<template>
  <view class="voice-delete" />
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'

export default {
  name: '',
  setup() {
    const store = useStore()
    Taro.showModal({
      title: '删除声源',
      content: '删除后不可恢复，确定要操作吗？'
    })
    .then(res => {
      if (res.cancel) {
        return
      }
      store.commit('live/DELETE_VOICE_ITEM')
    })
  }
}
</script>

<style lang="scss">
</style>
