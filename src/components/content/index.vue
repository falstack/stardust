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

export default {
  name: 'ContentMsg',
  components: {
    Txt
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
</style>
