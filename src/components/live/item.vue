<template>
  <Navigator
    class="live-item"
    :url="`/pages/room/live/index?id=${item.id}`"
  >
    {{ item }}
  </Navigator>
</template>

<script>
import { Navigator } from '@tarojs/components'

export default {
  name: '',
  components: {
    Navigator
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {

    }
  }
}
</script>

<style lang="scss">
</style>
