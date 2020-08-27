<template>
  <view class="nickname">
    {{ user.nickname }}
  </view>
</template>

<script>
export default {
  name: 'Nickname',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
</style>
