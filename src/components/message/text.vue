<template>
  <view class="text-msg">
    {{ item.content[0] }}
  </view>
</template>

<script>
export default {
  name: 'TextMsg',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    console.log(props)
  }
}
</script>
