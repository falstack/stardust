<template>
  <view class="json-content-txt-parser">
    <blockquote v-text="item.text" />
  </view>
</template>

<script>
export default {
  name: 'JsonContentTxtParser',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.json-content-txt-parser {
  blockquote {
    margin: 15px 15px 20px 16px;
    padding-left: 12px;
    color: $color-text-normal;
    border-left: 3px solid #d3d3d3;
    font-size: 17px;
    line-height: 30px;
    @extend %breakWord;
  }
}
</style>
