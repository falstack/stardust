<template>
  <view>
    <Navbar />
    <view>
      index
    </view>
  </view>
</template>

<script>
import Navbar from '~/components/navbar'

export default {
  components: {
    Navbar
  },
  onShareAppMessage() {
    return {
      title: '测试分享',
      path: '/pages/index/index'
    }
  },
}
</script>

<style lang="scss">
</style>
