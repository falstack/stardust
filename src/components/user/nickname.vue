<template>
  <view class="nickname">
    {{ user.nickname || user.name }}
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
