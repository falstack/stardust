<template>
  <view
    class="avatar"
    :style="style"
  >
    <image :src="$utils.resize(item.avatar, { width: 80 })" />
  </view>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const style = computed(() => {
      return {
        borderColor: props.item.color.bg
      }
    })

    return {
      style
    }
  }
}
</script>

<style lang="scss">
.avatar {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 2PX solid #f5f5f7;
  border-radius: 50%;
  background-color: #fff;

  image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
