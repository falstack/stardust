<template>
  <view class="avatar">
    <image class="face" :src="$utils.resize(user.avatar, { width: 80 })" />
  </view>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.avatar {
  width: 80px;
  height: 80px;

  .face {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
