<template>
  <view class="avatar">
    {{ user.nickname }}
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
  border-radius: 50%;
}
</style>
