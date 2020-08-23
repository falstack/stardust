<style lang="scss">
$item-size: 80px;

.code-input {
  position: relative;
  width: 100%;
  height: $item-size;

  .input {
    opacity: 0;
    display: block;
    width: 100%;
    height: $item-size;
    line-height: $item-size;
    caret-color: $color-red;
    color: transparent;
    box-sizing: border-box;
    padding-left: $item-size / 2 - 2;
    margin: 0 auto;
  }

  &__wrap {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: $item-size;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    user-select: none;
    transform: translateX(-50%);

    .item {
      width: $item-size;
      height: $item-size;
      border-radius: 10px;
      text-align: center;
      border: 2px solid #CCD6DD;
      line-height: $item-size - 2;
      margin-right: 10px;
      flex-shrink: 0;
      transition: border-color 200ms;

      &.is-active {
        border-color: $color-red;
      }
    }
  }
}
</style>

<template>
  <view class="code-input">
    <input
      v-model="code"
      class="input"
      type="number"
      auto-focus="true"
      confirm-type="send"
      adjustPosition=""
      :maxlength="length"
      :disabled="disabled"
      :style="`padding-left:${36 * count + 18}px`"
    />
    <view class="code-input__wrap">
      <view
        v-for="(item, index) in length"
        :key="item"
        :class="{ 'is-active': count === index }"
        class="item"
      >
        {{ code[index] }}
      </view>
    </view>
  </view>
</template>

<script>
// TODO：code-input 只要在 375 宽的时候和外面的 input 等高。。
export default {
  name: 'CodeInput',
  components: {},
  props: {
    value: {
      required: true,
      type: [String, Number]
    },
    length: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      code: this.value,
      loading: false,
      disabled: false,
      count: 0
    }
  },
  watch: {
    value(val) {
      this.code = val
    },
    code(val) {
      this.count = val.length
      this.$emit('input', val)
      if (this.count === this.length) {
        this.$emit('submit')
      }
    }
  }
}
</script>
