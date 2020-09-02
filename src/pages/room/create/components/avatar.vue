<template>
  <view class="avatar">
    <image
      class="avatar"
      :src="$utils.resize(item.avatar, { width: 80 })"
    />
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
}
</script>

<style lang="scss">
.avatar {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 2px solid #f5f5f7;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: -20px;
}
</style>
