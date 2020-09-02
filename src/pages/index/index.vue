<template>
  <view class="index">
    <view>测试页面</view>
    <Navigator url="/pages/room/live/index">
      语音房
    </Navigator>
    <Navigator url="/pages/room/create/index">
      剪辑室
    </Navigator>
  </view>
</template>

<script>
import { Navigator } from '@tarojs/components'

export default {
  components: {
    Navigator
  }
}
</script>
