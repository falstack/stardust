<template>
  <view class="user-about">
    <button
      class="primary-btn"
      @tap="userLogout"
    >
      退出登录
    </button>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { useStore } from 'vuex'

export default {
  name: 'UserHome',
  setup() {
    const store = useStore()

    const userLogout = async () => {
      await store.dispatch('userLogout')
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }

    return {
      userLogout
    }
  }
}
</script>

<style lang="scss">
.user-about {
  padding: $container-padding;
}
</style>
