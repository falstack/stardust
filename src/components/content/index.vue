<template>
  <view class="content-msg">
    <component
      :is="item.type"
      v-for="(item, index) in content"
      :key="index"
      :item="item"
    />
  </view>
</template>

<script>
import Txt from './txt'
import Mp3 from './mp3'

export default {
  name: 'ContentMsg',
  components: {
    Txt,
    Mp3
  },
  props: {
    content: {
      required: true,
      type: Array
    }
  }
}
</script>

<style lang="scss">
.content-msg {
  text {
    word-break: break-all;
    font-size: 32px;
  }
}
</style>
